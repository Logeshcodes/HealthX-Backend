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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const jwt_1 = __importDefault(require("../utils/jwt"));
const enum_1 = require("../utils/enum");
const constants_1 = require("../utils/constants");
(0, dotenv_1.config)();
const JWT_SECRET = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Auth middleware entered');
    const userAccessToken = req.cookies['accessToken'];
    const userRefreshToken = req.cookies['refreshToken'];
    const doctorAccessToken = req.cookies['accessToken2'];
    const doctorRefreshToken = req.cookies['refreshToken2'];
    const adminAccessToken = req.cookies['accessToken3'];
    const adminRefreshToken = req.cookies['refreshToken3'];
    console.log('Cookies received:', req.cookies);
    console.log('User accessToken:', userAccessToken);
    console.log('Doctor accessToken:', doctorAccessToken);
    console.log('Admin accessToken:', adminAccessToken);
    const accessToken = adminAccessToken || doctorAccessToken || userAccessToken;
    const refreshToken = adminRefreshToken || doctorRefreshToken || userRefreshToken;
    if (!accessToken) {
        return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ failToken: true, message: constants_1.ResponseError.NO_ACCESS_TOKEN });
    }
    try {
        const accessPayload = jsonwebtoken_1.default.verify(accessToken, JWT_SECRET);
        console.log('Access token verified:', accessPayload);
        req.user = accessPayload;
        return next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');
            if (!refreshToken) {
                console.log('No refresh token provided');
                return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ failToken: true, message: constants_1.ResponseError.NO_ACCESS_TOKEN });
            }
            // Verify Refresh Token
            try {
                const refreshPayload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
                if (!refreshPayload) {
                    return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.ResponseError.INVALID_REFRESH_TOKEN });
                }
                // Check if refresh token is expired
                const currentTime = Math.floor(Date.now() / 1000);
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    console.log('Refresh token expired');
                    return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.ResponseError.REFRESH_TOKEN_EXPIRED });
                }
                console.log('Refresh token verified:', refreshPayload);
                // Generate a new Access Token
                const jwtt = new jwt_1.default();
                const newAccessToken = yield jwtt.accessToken({
                    email: refreshPayload.email,
                    role: refreshPayload.role
                });
                console.log(constants_1.ResponseError.NEW_ACCESS_TOKEN_GENERATED, newAccessToken);
                // Set the new Access Token in cookies based on role
                if (refreshPayload.role === 'Admin') {
                    res.cookie('accessToken3', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken3'] = newAccessToken;
                }
                else if (refreshPayload.role === 'Doctor') {
                    res.cookie('accessToken2', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken2'] = newAccessToken;
                }
                else {
                    res.cookie('accessToken', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken'] = newAccessToken;
                }
                req.user = refreshPayload;
                return next();
            }
            catch (refreshErr) {
                if (refreshErr.name === 'TokenExpiredError') {
                    console.log('Refresh token expired');
                    return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.ResponseError.REFRESH_TOKEN_EXPIRED });
                }
                console.log('Invalid refresh token:', refreshErr.message);
                return res.status(enum_1.StatusCode.UNAUTHORIZED).json({ message: constants_1.ResponseError.INVALID_REFRESH_TOKEN });
            }
        }
        console.log('Invalid access token:', err.message);
        return res.status(enum_1.StatusCode.BAD_REQUEST).json({ message: constants_1.ResponseError.INVALID_JWT });
    }
});
exports.default = authenticateToken;
