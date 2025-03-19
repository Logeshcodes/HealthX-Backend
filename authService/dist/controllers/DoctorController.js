"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGenerator_1 = require("../utils/otpGenerator");
const jwt_1 = __importDefault(require("../utils/jwt"));
const constants_1 = require("../utils/constants");
const enum_1 = require("../utils/enum");
const producer_1 = __importDefault(require("../config/kafka/producer"));
class DoctorController {
    constructor(doctorService, otpService) {
        this.doctorService = doctorService;
        this.otpService = otpService;
        this.otpGenerate = new otpGenerator_1.OtpGenerate();
        this.JWT = new jwt_1.default();
    }
    doctorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, email, password, Mobile, department, gender, consultationType, education, experience, description, } = req.body;
                console.log("Doctor Signup Data:", name, email, password, Mobile, department, gender, consultationType, education, experience, description);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const ExistingDoctor = yield this.doctorService.findByEmail(email);
                console.log(ExistingDoctor, "ExistingDoctor");
                if (ExistingDoctor) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.EXISTING_USER,
                        user: ExistingDoctor,
                    });
                }
                else {
                    const otp = yield this.otpGenerate.createOtpDigit();
                    yield this.otpService.createOtp(email, otp);
                    (0, producer_1.default)("send-otp-email", { email, otp });
                    const JWT = new jwt_1.default();
                    const tokenPayload = {
                        name,
                        email,
                        hashedPassword,
                        Mobile,
                        department,
                        gender,
                        consultationType,
                        education,
                        experience,
                        description,
                        role: "Doctor",
                    };
                    const token = yield JWT.createToken(tokenPayload);
                    return res.status(enum_1.StatusCode.CREATED).json({
                        success: true,
                        message: constants_1.ResponseError.SIGNUP_SUCCESS,
                        token,
                    });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ResponseError.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                console.log(email, "emaillllll");
                const otp = yield this.otpGenerate.createOtpDigit();
                yield Promise.all([
                    this.otpService.createOtp(email, otp),
                    (0, producer_1.default)("send-otp-email", { email, otp }),
                ]);
                res.status(enum_1.StatusCode.OK).json({
                    success: true,
                    message: constants_1.ResponseError.OTP_RESENDED,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                console.log(req.file, "reqqq");
                console.log(req.headers, "headersssss");
                const token = req.headers["the-verify-token"] || "";
                console.log(token, "token");
                if (typeof token != "string") {
                    throw new Error();
                }
                const decode = yield this.JWT.verifyToken(token);
                console.log("decode Token data : ", decode);
                if (!decode) {
                    return new Error("token has expired, register again");
                }
                const resultOtp = yield this.otpService.findOtp(decode.email);
                console.log(resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp, "<>", otp);
                if ((resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp) === otp) {
                    console.log("matched");
                    console.log("decode???", decode);
                    const user = yield this.doctorService.createUser(decode);
                    if (user) {
                        yield (0, producer_1.default)("add-doctor", user);
                        yield this.otpService.deleteOtp(user.email);
                        return res.status(enum_1.StatusCode.CREATED).json({
                            success: true,
                            message: constants_1.ResponseError.ACCOUNT_CREATED,
                            user,
                        });
                    }
                }
                else {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.WRONG_OTP,
                    });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ResponseError.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const doctor = yield this.doctorService.findByEmail(email);
                if (!doctor) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_EMAIL,
                    });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, doctor.hashedPassword);
                console.log(isPasswordValid, "isPasswordValid");
                if (!isPasswordValid) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_PASSWORD,
                    });
                }
                if (doctor.status === "blocked") {
                    console.log(" blocked...");
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.ACCOUNT_BLOCKED,
                    });
                }
                let role = doctor.role;
                const accesstoken = yield this.JWT.accessToken({ email, role });
                const refreshToken = yield this.JWT.refreshToken({ email, role });
                return res
                    .status(enum_1.StatusCode.OK)
                    .cookie("accessToken2", accesstoken, { httpOnly: true })
                    .cookie("refreshToken2", refreshToken, { httpOnly: true })
                    .send({
                    success: true,
                    message: constants_1.ResponseError.ACCOUNT_LOGIN_SUCCESS,
                    user: doctor,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ResponseError.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }
    doGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Google login in controller", req.body);
                const { email } = req.body;
                const ExistingDoctor = yield this.doctorService.findByEmail(email);
                if (!ExistingDoctor) {
                    console.log("Doctor does not exist. Redirecting to registration page.");
                    res.status(enum_1.StatusCode.REDIRECT).json({
                        success: false,
                        message: constants_1.ResponseError.CREATE_ACCOUNT,
                        redirectUrl: "/doctor/register",
                    });
                }
                else {
                    if (!ExistingDoctor.isBlocked) {
                        const role = ExistingDoctor.role;
                        const id = ExistingDoctor._id;
                        const accesstoken = yield this.JWT.accessToken({ id, email, role });
                        const refreshToken = yield this.JWT.refreshToken({ id, email, role });
                        console.log(accesstoken, "-----", refreshToken);
                        res
                            .status(enum_1.StatusCode.OK)
                            .cookie("accessToken2", accesstoken, { httpOnly: true })
                            .cookie("refreshToken2", refreshToken, { httpOnly: true })
                            .json({
                            success: true,
                            message: constants_1.ResponseError.GOOGLE_LOGIN,
                            user: ExistingDoctor,
                        });
                    }
                    else {
                        res.status(enum_1.StatusCode.ACCESS_FORBIDDEN).json({
                            success: false,
                            message: constants_1.ResponseError.ACCOUNT_BLOCKED,
                            user: ExistingDoctor,
                        });
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Doctor logged out");
                res.clearCookie("accessToken2");
                res.clearCookie("refreshToken2");
                res
                    .status(enum_1.StatusCode.OK)
                    .send({ success: true, message: constants_1.ResponseError.ACCOUNT_LOGOUT });
            }
            catch (error) {
                console.error("Error during logout:", error);
                res
                    .status(enum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .send({ success: false, message: constants_1.ResponseError.INTERNAL_SERVER_ERROR });
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                let existingUser = yield this.doctorService.findByEmail(email);
                console.log(existingUser, "existingUser");
                if (existingUser) {
                    const otp = yield this.otpGenerate.createOtpDigit();
                    yield this.otpService.createOtp(email, otp);
                    (0, producer_1.default)("send-forgotPassword-email", { email, otp });
                    res.send({
                        success: true,
                        message: constants_1.ResponseError.OTP_REDIRECT,
                        data: existingUser,
                    });
                }
                else {
                    res.send({
                        success: false,
                        message: constants_1.ResponseError.USER_NOT_FOUND,
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    forgotResendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                console.log(email, "emaillllll");
                const otp = yield this.otpGenerate.createOtpDigit();
                yield this.otpService.createOtp(email, otp);
                (0, producer_1.default)("send-forgotPassword-email", { email, otp });
                res.status(enum_1.StatusCode.OK).json({
                    success: true,
                    message: constants_1.ResponseError.OTP_RESENDED,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ResponseError.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }
    verifyResetOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const resultOtp = yield this.otpService.findOtp(email);
                console.log(resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp, "<>", otp);
                if ((resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp) === otp) {
                    console.log("matched");
                    let token = yield this.JWT.createToken({ email });
                    res.status(enum_1.StatusCode.OK).cookie("forgotToken", token).json({
                        success: true,
                        message: constants_1.ResponseError.RESET_PASSWORD,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: constants_1.ResponseError.WRONG_OTP,
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                console.log("new pwd :", password);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                console.log("hp", hashedPassword);
                console.log("reset password :", req.cookies.forgotToken);
                const token = req.cookies.forgotToken;
                let data = yield this.JWT.verifyToken(token);
                if (!data) {
                    throw new Error("Token expired retry reset password");
                }
                console.log("email to rsetpwd", data.email);
                const passwordReset = yield this.doctorService.resetPassword(data.email, hashedPassword);
                if (passwordReset) {
                    yield (0, producer_1.default)("password-reset-doctor", passwordReset);
                    res.clearCookie("forgotToken");
                    res.status(enum_1.StatusCode.OK).json({
                        success: true,
                        message: constants_1.ResponseError.RESET_PASSWORD_SUCCESS,
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    // - Kafka Consume
    updatePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data.email, data.password, "consumeeeeee");
                yield this.doctorService.resetPassword(data.email, data.password);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, profilePicture } = data;
                console.log(data, "consumeeee....");
                yield this.doctorService.updateProfile(email, profilePicture);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockDoctor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, isBlocked } = data;
                console.log(data, "consumeeee....");
                yield this.doctorService.blockDoctor(email, isBlocked);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = DoctorController;
