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
(0, dotenv_1.config)();
class JwtService {
    createToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.JWT_SECRET || "mySecertPassword";
            if (!secret) {
                throw new Error("JWT_SECRET is not defined in the environment variables");
            }
            const verifyToken = yield jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn: "2hr",
            });
            return verifyToken;
        });
    }
    accessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.JWT_SECRET || "mySecertPassword";
            if (!secret) {
                throw new Error("JWT_SECRET is not defined in the environment variables");
            }
            const verifyToken = yield jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn: "2hr",
            });
            console.log("secert :", secret, verifyToken);
            return verifyToken;
        });
    }
    refreshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.JWT_SECRET || "mySecertPassword";
            if (!secret) {
                throw new Error("JWT_SECRET is not defined in the environment variables");
            }
            const verifyToken = yield jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn: "3hr",
            });
            return verifyToken;
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("verify ");
                const secret = process.env.JWT_SECRET || "mySecertPassword";
                const data = yield jsonwebtoken_1.default.verify(token, secret);
                console.log(data, "verify data");
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = JwtService;
