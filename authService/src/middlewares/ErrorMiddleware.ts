import { Response, Request, NextFunction } from "express";
import ErrorHandler from "./ErrorHandler";
import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    err.message = err.message || ResponseError.INTERNAL_SERVER_ERROR;

    if (err.name === 'CastError') {
        const message = `${ResponseError.INVALID_RESOURCE}: ${err.path}`;
        err = new ErrorHandler(StatusCode.BAD_REQUEST, message);
    }

    if (err.code === 11000) {
        const message = `${ResponseError.DUPLICATE_RESOURCE} ${Object.keys(err.keyValue).join(", ")}`;
        err = new ErrorHandler(StatusCode.BAD_REQUEST, message);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = ResponseError.INVALID_JWT;
        err = new ErrorHandler(StatusCode.UNAUTHORIZED, message);
    }

    if (err.name === 'TokenExpiredError') {
        const message = ResponseError.EXPIRED_JWT;
        err = new ErrorHandler(StatusCode.UNAUTHORIZED, message);
    }

    console.log('Error occurred:', err.statusCode, err.message);

    res.status(err.statusCode).json({
        status: err.statusCode,
        success: false,
        message: err.message
    });
}
