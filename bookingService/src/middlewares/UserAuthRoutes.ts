import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import JwtService from '../utils/jwt';
import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";
import dotenv from 'dotenv';
dotenv.config() 

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        email: string;
        role: string;
        iat: number;
        exp: number;
    };
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    console.log('Auth middleware entered');

    const userAccessToken = req.cookies['accessToken'];
    const userRefreshToken = req.cookies['refreshToken'];
    const doctorAccessToken = req.cookies['accessToken2'];
    const doctorRefreshToken = req.cookies['refreshToken2'];
    const adminAccessToken = req.cookies['accessToken3'];
    const adminRefreshToken = req.cookies['refreshToken3'];

    const accessToken = adminAccessToken || doctorAccessToken || userAccessToken;
    const refreshToken = adminRefreshToken || doctorRefreshToken || userRefreshToken;

    console.log('Cookies received:', req.cookies);
    console.log("JWT__________SECRET",process.env.JWT_SECRET || 'mySecertPassword');

    if (!accessToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
    }

    try {
        const accessPayload = jwt.verify(accessToken, process.env.JWT_SECRET || 'mySecertPassword') as AuthenticatedRequest['user'];
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');
            if (!refreshToken) {
                console.log('No refresh token provided');
                return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
            }

            try {
                const refreshPayload = jwt.verify(refreshToken, process.env.JWT_SECRET || 'mySecertPassword') as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
                }

                const currentTime = Math.floor(Date.now() / 1000); 
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    console.log('Refresh token expired');
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
                }

                const jwtt = new JwtService();
                const newAccessToken = await jwtt.accessToken({ email: refreshPayload.email, role: refreshPayload.role});

                res.cookie('accessToken', newAccessToken, { httpOnly: true});
                req.cookies['accessToken'] = newAccessToken;
                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === 'TokenExpiredError') {
                    console.log('Refresh token expired');
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
                }
                return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
            }
        }
        return res.status(StatusCode.BAD_REQUEST).json({ message: ResponseError.INVALID_JWT });
    }
};

export default authenticateToken;
