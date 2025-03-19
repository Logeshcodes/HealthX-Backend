"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorHandler_1 = __importDefault(require("./ErrorHandler"));
const enum_1 = require("../utils/enum");
const constants_1 = require("../utils/constants");
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || enum_1.StatusCode.INTERNAL_SERVER_ERROR;
    err.message = err.message || constants_1.ResponseError.INTERNAL_SERVER_ERROR;
    if (err.name === 'CastError') {
        const message = `${constants_1.ResponseError.INVALID_RESOURCE}: ${err.path}`;
        err = new ErrorHandler_1.default(enum_1.StatusCode.BAD_REQUEST, message);
    }
    if (err.code === 11000) {
        const message = `${constants_1.ResponseError.DUPLICATE_RESOURCE} ${Object.keys(err.keyValue).join(", ")}`;
        err = new ErrorHandler_1.default(enum_1.StatusCode.BAD_REQUEST, message);
    }
    if (err.name === 'JsonWebTokenError') {
        const message = constants_1.ResponseError.INVALID_JWT;
        err = new ErrorHandler_1.default(enum_1.StatusCode.UNAUTHORIZED, message);
    }
    if (err.name === 'TokenExpiredError') {
        const message = constants_1.ResponseError.EXPIRED_JWT;
        err = new ErrorHandler_1.default(enum_1.StatusCode.UNAUTHORIZED, message);
    }
    console.log('Error occurred:', err.statusCode, err.message);
    res.status(err.statusCode).json({
        status: err.statusCode,
        success: false,
        message: err.message
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
