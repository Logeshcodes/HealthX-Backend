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
exports.IsAdmin = exports.IsDoctor = exports.IsUser = void 0;
const jwt_1 = __importDefault(require("@/utils/jwt"));
const enum_1 = require("../utils/enum");
const constants_1 = require("../utils/constants");
const IsUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Token = req.cookies.accessToken;
        if (!Token) {
            res.status(enum_1.StatusCode.UNAUTHORIZED).send(constants_1.ResponseError.ACCESS_FORBIDDEN);
            return;
        }
        const JWT = new jwt_1.default();
        const decode = yield JWT.verifyToken(Token);
        if (decode) {
            if (decode.role !== "User") {
                res
                    .status(enum_1.StatusCode.UNAUTHORIZED)
                    .send(constants_1.ResponseError.ACCESS_FORBIDDEN);
                return;
            }
        }
        next();
    }
    catch (error) {
        throw error;
    }
});
exports.IsUser = IsUser;
const IsDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Token = req.cookies.accessToken2;
        if (!Token) {
            res.status(enum_1.StatusCode.UNAUTHORIZED).send(constants_1.ResponseError.ACCESS_FORBIDDEN);
            return;
        }
        const JWT = new jwt_1.default();
        const decode = yield JWT.verifyToken(Token);
        if (decode) {
            if (decode.role !== "Doctor") {
                res
                    .status(enum_1.StatusCode.UNAUTHORIZED)
                    .send(constants_1.ResponseError.ACCESS_FORBIDDEN);
                return;
            }
        }
        next();
    }
    catch (error) {
        throw error;
    }
});
exports.IsDoctor = IsDoctor;
const IsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Token = req.cookies.accessToken3;
        if (!Token) {
            res.status(enum_1.StatusCode.UNAUTHORIZED).send(constants_1.ResponseError.ACCESS_FORBIDDEN);
            return;
        }
        const JWT = new jwt_1.default();
        const decode = yield JWT.verifyToken(Token);
        if (decode) {
            if (decode.role !== "Admin") {
                res
                    .status(enum_1.StatusCode.UNAUTHORIZED)
                    .send(constants_1.ResponseError.ACCESS_FORBIDDEN);
                return;
            }
        }
        next();
    }
    catch (error) {
        throw error;
    }
});
exports.IsAdmin = IsAdmin;
