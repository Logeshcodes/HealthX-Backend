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
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGenerator_1 = require("../utils/otpGenerator");
const jwt_1 = __importDefault(require("../utils/jwt"));
const producer_1 = __importDefault(require("../config/kafka/producer"));
const enum_1 = require("../utils/enum");
const constants_1 = require("../utils/constants");
class UserController {
    constructor(userService, otpService) {
        this.userService = userService;
        this.otpService = otpService;
        this.otpGenerator = new otpGenerator_1.OtpGenerate();
        this.JWT = new jwt_1.default();
    }
    userSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, password, mobileNumber } = req.body;
                console.log("User Signup Data : ", username, email, password, mobileNumber);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const ExistingUser = yield this.userService.findByEmail(email);
                console.log(ExistingUser, "Existing User");
                if (ExistingUser) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.EXISTING_USER,
                    });
                }
                else {
                    const otp = yield this.otpGenerator.createOtpDigit();
                    yield Promise.all([
                        this.otpService.createOtp(email, otp),
                        (0, producer_1.default)("send-otp-email", { email, otp }),
                    ]);
                    const token = yield this.JWT.createToken({
                        username,
                        email,
                        hashedPassword,
                        mobileNumber,
                        role: "User",
                    });
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
                    error: error.message,
                });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                const otp = yield this.otpGenerator.createOtpDigit();
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
                console.log("OTP details ? : ", otp);
                const token = req.headers["the-verify-token"] || "";
                console.log(token, "token???");
                if (typeof token != "string") {
                    throw new Error();
                }
                const decode = yield this.JWT.verifyToken(token);
                console.log(decode, "decode User token????");
                if (!decode) {
                    return new Error("token has expired, register again");
                }
                const resultOtp = yield this.otpService.findOtp(decode.email);
                console.log(resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp, "<>", otp);
                if ((resultOtp === null || resultOtp === void 0 ? void 0 : resultOtp.otp) === otp) {
                    const user = yield this.userService.createUser(decode);
                    if (user) {
                        yield (0, producer_1.default)("add-user", user);
                        console.log("user.email", user.email);
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
                    error: error.message,
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log("login Data :", email, password);
                const User = yield this.userService.findByEmail(email);
                if (!User) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_EMAIL,
                    });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, User.hashedPassword);
                if (User.isBlocked) {
                    console.log(" blocked...");
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.ACCOUNT_BLOCKED,
                    });
                }
                if (!isPasswordValid) {
                    return res.json({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_PASSWORD,
                    });
                }
                let role = User.role;
                console.log("isPasswordValid , role :", isPasswordValid, role);
                const accesstoken = yield this.JWT.accessToken({ email, role });
                const refreshToken = yield this.JWT.refreshToken({ email, role });
                return res
                    .status(enum_1.StatusCode.OK)
                    .cookie("accessToken", accesstoken, { httpOnly: true })
                    .cookie("refreshToken", refreshToken, { httpOnly: true })
                    .send({
                    success: true,
                    message: constants_1.ResponseError.ACCOUNT_LOGIN_SUCCESS,
                    user: User,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ResponseError.INTERNAL_SERVER_ERROR,
                    error: error.message,
                });
            }
        });
    }
    doGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Google login in controller", req.body);
                const { name, email, password, profilePicture, mobileNumber } = req.body;
                const hashedPassword = password;
                const existingStudent = yield this.userService.findByEmail(email);
                if (!existingStudent) {
                    const userData = {
                        username: name,
                        email,
                        hashedPassword,
                        profilePicture,
                        mobileNumber,
                        authenticationMethod: "Google",
                        role: "User",
                        isBlocked: false,
                    };
                    const user = yield this.userService.googleLogin(userData);
                    console.log(user, "User after creation in controller Google");
                    if (user) {
                        yield (0, producer_1.default)("add-user", user);
                        console.log(user.token, "User token");
                        const role = user.role;
                        const accesstoken = yield this.JWT.accessToken({ email, role });
                        const refreshToken = yield this.JWT.refreshToken({ email, role });
                        console.log(accesstoken, "-----", refreshToken);
                        res
                            .status(enum_1.StatusCode.OK)
                            .cookie("accessToken", accesstoken, { httpOnly: true })
                            .cookie("refreshToken", refreshToken, { httpOnly: true })
                            .json({
                            success: true,
                            message: constants_1.ResponseError.GOOGLE_LOGIN,
                            user: user,
                        });
                    }
                }
                else {
                    if (!existingStudent.isBlocked) {
                        const role = existingStudent.role;
                        const id = existingStudent._id;
                        const accesstoken = yield this.JWT.accessToken({ id, email, role });
                        const refreshToken = yield this.JWT.refreshToken({ id, email, role });
                        console.log(accesstoken, "-----", refreshToken);
                        res
                            .status(enum_1.StatusCode.OK)
                            .cookie("accessToken", accesstoken, { httpOnly: true })
                            .cookie("refreshToken", refreshToken, { httpOnly: true })
                            .json({
                            success: true,
                            message: constants_1.ResponseError.GOOGLE_LOGIN,
                            user: existingStudent,
                        });
                    }
                    else {
                        res
                            .status(enum_1.StatusCode.OK)
                            .json({
                            success: false,
                            message: constants_1.ResponseError.ACCOUNT_BLOCKED,
                            user: existingStudent,
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
                console.log("User logged out");
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
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
                let existingUser = yield this.userService.findByEmail(email);
                console.log(existingUser, "existing User");
                if (existingUser) {
                    const otp = yield this.otpGenerator.createOtpDigit();
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
                console.log(email, "email*");
                const otp = yield this.otpGenerator.createOtpDigit();
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
                    error: error.message,
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
                    yield this.otpService.deleteOtp(email);
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
                const passwordReset = yield this.userService.resetPassword(data.email, hashedPassword);
                if (passwordReset) {
                    yield (0, producer_1.default)("password-reset-user", passwordReset);
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
    // consumed kafka codes
    updatePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data.email, data.password, "consumeeeeee");
                yield this.userService.resetPassword(data.email, data.password);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, profilePicture } = data;
                console.log(data, "consumeeee....");
                yield this.userService.updateProfile(email, profilePicture);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, isBlocked } = data;
                yield this.userService.blockUser(email, isBlocked);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.UserController = UserController;
