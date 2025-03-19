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
exports.AdminController = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const dotenv_1 = require("dotenv");
const producer_1 = __importDefault(require("../config/kafka/producer"));
const constants_1 = require("../utils/constants");
const enum_1 = require("../utils/enum");
(0, dotenv_1.config)();
class AdminController {
    constructor(adminService) {
        this.JWT = new jwt_1.default();
        this.adminService = adminService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const AdminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
            const AdminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
            try {
                const { email, password } = req.body;
                let admin = yield this.adminService.getAdminData(email);
                if (!admin) {
                    admin = yield this.adminService.createAdmin(email, password);
                    admin && (yield (0, producer_1.default)("add-admin", admin));
                }
                else if (email !== AdminEmail) {
                    return res.send({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_EMAIL,
                    });
                }
                else if (password !== AdminPassword) {
                    return res.send({
                        success: false,
                        message: constants_1.ResponseError.INVAILD_PASSWORD,
                    });
                }
                console.log(email, password, "admin");
                const accesstoken = yield this.JWT.accessToken({ email, role: "admin" });
                const refreshtoken = yield this.JWT.accessToken({ email, role: "admin" });
                return res
                    .cookie("accessToken3", accesstoken, { httpOnly: true })
                    .cookie("refreshToken3", refreshtoken, { httpOnly: true })
                    .send({
                    success: true,
                    message: "Welcome back, Admin!",
                    data: { email, role: "admin" },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("admin logged out");
                res.clearCookie("accessToken3", {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                });
                res.clearCookie("refreshToken3", {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                });
                res
                    .status(enum_1.StatusCode.OK)
                    .send({ success: true, message: constants_1.ResponseError.ACCOUNT_LOGOUT });
            }
            catch (error) {
                console.error("Error during admin logout:", error);
                res
                    .status(enum_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .send({ success: false, message: constants_1.ResponseError.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AdminController = AdminController;
