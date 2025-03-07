import express, { Application , Request ,Response , NextFunction } from 'express'
import cors from 'cors'                                                
import { config } from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware'
import proxy = require('express-http-proxy')
import morgan from "morgan" ;


config();

const {PORT ,  FRONTEND_URL , AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL , BOOKING_URL, VIDEO_CALL_URL  } = process.env

const app : Application = express()

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL , BOOKING_URL , VIDEO_CALL_URL  });

// cors

const corsOptions = {
    origin: FRONTEND_URL,
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
};

// Middleware

app.use(cors(corsOptions));
app.use(morgan('dev'));

// services 
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
        console.error("Invalid service configuration:", { context, path });
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
    res.status(500).json({ error: "Internal Server Error" });
});

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(401).json({ error: "authentication credentials were invalid" });
});

app.listen(PORT , ()=>{
    console.log(`API Gateway running at http://localhost:${PORT}`);
})


