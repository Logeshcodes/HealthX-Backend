import express, { Application , Request ,Response , NextFunction } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { config } from 'dotenv'
import morgan from "morgan" ;
import cors from 'cors'   

import { ResponseError } from './utils/constants';
import { StatusCode } from './utils/enum';

config();

const {PORT, FRONTEND_URL, AUTH_URL, USER_URL ,NOTIFICATION_URL, VERIFICATION_URL , BOOKING_URL, VIDEO_CALL_URL } = process.env ;

console.log("Environment Variables:",{ PORT, FRONTEND_URL, AUTH_URL, USER_URL, NOTIFICATION_URL, VERIFICATION_URL, BOOKING_URL, VIDEO_CALL_URL});

const app : Application = express()

const corsOptions = {
    origin: FRONTEND_URL,
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
};

// Middleware

app.use(cors(corsOptions));
app.use(morgan('dev'));

const services = [
    {
        path: AUTH_URL,
        context: "/auth",
    },
    {
        path: USER_URL, 
        context: "/user", 
    },
    {
        path: NOTIFICATION_URL, 
        context: "/notification", 
    },
    {
        path: VERIFICATION_URL, 
        context: "/verification", 
    },
    {
        path: BOOKING_URL, 
        context: "/booking", 
    },
    {
        path: VIDEO_CALL_URL , 
        context: "/videoCall", 
    },
];

services.forEach(({ context, path }) => {
    if (!path || !context) {
        console.error("Invalid service configuration : ", { context, path });
        return;
    }
    app.use(
        context,
        createProxyMiddleware({
            target: path,
            changeOrigin: true,
        })
    );
});

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: ResponseError.INTERNAL_SERVER_ERROR });
});

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(StatusCode.UNAUTHORIZED).json({ error: ResponseError.ACCESS_FORBIDDEN });
});

app.listen(PORT , ()=>{
    console.log(`API Gateway running at http://localhost:${PORT}`);
})


