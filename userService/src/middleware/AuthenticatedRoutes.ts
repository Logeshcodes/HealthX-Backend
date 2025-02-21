// import jwt from 'jsonwebtoken';
// import { NextFunction, Request, Response } from 'express';
// // import { config } from 'dotenv';
// import JwtService from '../utils/jwt';
// import { StatusCode } from "../utils/enum";
// import { ResponseError } from "../utils/constants";
// import dotenv from 'dotenv';
// dotenv.config() 
// // config();

// const JWT_SECRET = "mySecertPassword"
// // const JWT_SECRET = process.env.JWT_SECRET as string;

// interface AuthenticatedRequest extends Request {
//     user?: {
//         user: string;
//         email: string;
//         role: string;
//         iat: number;
//         exp: number;
//     };
// }

// const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
//     console.log('Auth middleware entered');

//     const accessToken = req.cookies['accessToken'];
//     const refreshToken = req.cookies['refreshToken'];

//     console.log('Cookies received:', req.cookies);
//     console.log("JWT__________SECRET",process.env.JWT_SECRET)

//     console.log('accessToken:', accessToken);

//     if (!accessToken) {
//         return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
//     }

//     try {
//         // Verify Access Token
//         console.log("......veri", JWT_SECRET)
//         const accessPayload = jwt.verify(accessToken, JWT_SECRET) as AuthenticatedRequest['user'];
//         console.log('Access token verified:', accessPayload);

//         // If valid, attach payload to request and proceed
//         req.user = accessPayload;
//         return next();
//     } catch (err: any) {
//         if (err.name === 'TokenExpiredError') {
//             console.log('Access token expired');

//             if (!refreshToken) {
//                 console.log('No refresh token provided');
//                 return res.status(StatusCode.UNAUTHORIZED).json({ failToken: true, message: ResponseError.NO_ACCESS_TOKEN });
//             }

//             // Verify Refresh Token
//             try {
//                 const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as AuthenticatedRequest['user'];
//                 if (!refreshPayload) {
//                     return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
//                 }

//                 // Check if the refresh token is expired
//                 const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//                 if (refreshPayload.exp && refreshPayload.exp < currentTime) {
//                     console.log('Refresh token expired');
//                     return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
//                 }

//                 console.log('Refresh token verified:', refreshPayload);

//                 // Generate a new Access Token
//                 const jwtt = new JwtService();
//                 const newAccessToken = await jwtt.accessToken({
//                     email: refreshPayload.email,
//                     role: refreshPayload.role
//                 });
//                 console.log(ResponseError.NEW_ACCESS_TOKEN_GENERATED, newAccessToken);

//                 // Set new Access Token in cookies
//                 res.cookie('accessToken', newAccessToken, {
//                     httpOnly: true,
//                 });

//                 req.cookies['accessToken'] = newAccessToken;

//                 req.user = refreshPayload;
                
//                 return next();
//             } catch (refreshErr: any) {
//                 if (refreshErr.name === 'TokenExpiredError') {
//                     console.log('Refresh token expired');
//                     return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.REFRESH_TOKEN_EXPIRED });
//                 }

//                 console.log('Invalid refresh token:', refreshErr.message);
//                 return res.status(StatusCode.UNAUTHORIZED).json({ message: ResponseError.INVALID_REFRESH_TOKEN });
//             }
//         }

//         console.log('Invalid access token:', err.message);
//         return res.status(StatusCode.BAD_REQUEST).json({ message: ResponseError.INVALID_JWT });
//     }
// };

// export default authenticateToken;
