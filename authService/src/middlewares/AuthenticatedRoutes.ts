import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import JwtService from '../utils/jwt';
import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';

config();

const JWT_SECRET = process.env.JWT_SECRET as string;

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

    console.log('Cookies received:', req.cookies);
    console.log('User accessToken:', userAccessToken);
    console.log('Doctor accessToken:', doctorAccessToken);
    console.log('Admin accessToken:', adminAccessToken);

    const accessToken = adminAccessToken || doctorAccessToken || userAccessToken;
    const refreshToken = adminRefreshToken || doctorRefreshToken || userRefreshToken;

    if (!accessToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
    }

    try {

        const accessPayload = jwt.verify(accessToken, JWT_SECRET) as AuthenticatedRequest['user'];
        console.log('Access token verified:', accessPayload);
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');

            if (!refreshToken) {
                console.log('No refresh token provided');
                return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
            }

            // Verify Refresh Token
            try {
                const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
                if (!refreshPayload) {
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
                }

                // Check if refresh token is expired
                const currentTime = Math.floor(Date.now() / 1000);
                if (refreshPayload.exp && refreshPayload.exp < currentTime) {
                    console.log('Refresh token expired');
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
                }

                console.log('Refresh token verified:', refreshPayload);

                // Generate a new Access Token
                const jwtt = new JwtService();
                const newAccessToken = await jwtt.accessToken({
                    email: refreshPayload.email,
                    role: refreshPayload.role
                });
                console.log(ResponseError.NEW_ACCESS_TOKEN_GENERATED, newAccessToken);

                // Set the new Access Token in cookies based on role
                if (refreshPayload.role === 'Admin') {
                    res.cookie('accessToken3', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken3'] = newAccessToken;
                } else if (refreshPayload.role === 'Doctor') {
                    res.cookie('accessToken2', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken2'] = newAccessToken;
                } else {
                    res.cookie('accessToken', newAccessToken, { httpOnly: true });
                    req.cookies['accessToken'] = newAccessToken;
                }

                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === 'TokenExpiredError') {
                    console.log('Refresh token expired');
                    return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
                }

                console.log('Invalid refresh token:', refreshErr.message);
                return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
            }
        }

        console.log('Invalid access token:', err.message);
        return res.status(StatusCode.BAD_REQUEST).json({ message: ResponseError.INVALID_JWT });
    }
};

export default authenticateToken;
