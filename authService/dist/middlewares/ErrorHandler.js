"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            status: this.statusCode,
            message: this.message,
            stack: this.stack
        };
    }
}
exports.ErrorHandler = ErrorHandler;
exports.default = ErrorHandler;
