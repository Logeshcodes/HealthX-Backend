import express, { Application , Request ,Response , NextFunction } from 'express'
import { createProxyMiddleware , Options  } from 'http-proxy-middleware'
import morgan from "morgan" ;
import cors from 'cors'   

import { ResponseError } from './utils/constants';
import { StatusCode } from './utils/enum';

import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

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


// Create server instance to handle both HTTP and WebSocket
const server = require('http').createServer(app);

// WebSocket handling for socket.io
interface ExtendedProxyOptions extends Options {
    ws?: boolean;
    // Add any other properties that TypeScript complains about
    onProxyReq?: (proxyReq: any, req: any, res: any) => void;
}
console.log("video call url---", VIDEO_CALL_URL)

app.use('/socket.io', createProxyMiddleware({
    target: VIDEO_CALL_URL,
    changeOrigin: true,
    ws: true,  // WebSocket support
    onProxyReq: (proxyReq, req, res) => {
        // Ensuring that the connection remains WebSocket
        proxyReq.setHeader('Connection', 'Upgrade');
        proxyReq.setHeader('Upgrade', 'websocket');
    },
}as ExtendedProxyOptions));

const services = [
    {
        path: AUTH_URL,
        context: "/api/auth",
    },
    {
        path: USER_URL, 
        context: "/api/user", 
    },
    {
        path: NOTIFICATION_URL, 
        context: "/api/notification", 
    },
    {
        path: VERIFICATION_URL, 
        context: "/api/verification", 
    },
    {
        path: BOOKING_URL, 
        context: "/api/booking", 
    },
    {
        path: VIDEO_CALL_URL , 
        context: "/api/videoCall", 
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


