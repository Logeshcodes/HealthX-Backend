import express, { Application , Request ,Response , NextFunction } from 'express'
import cors from 'cors'                                                
import { config } from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware'
import proxy = require('express-http-proxy')
import morgan from "morgan" ;


config();

const {PORT ,  FRONTEND_URL , AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL , BOOKING_URL } = process.env

const app : Application = express()

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL , USER_URL ,NOTIFICATION_URL , VERIFICATION_URL , BOOKING_URL });

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
];


// Setup proxies
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



// app.use('/auth',proxy('http://localhost:5001' ));
// app.use('/user',proxy('http://localhost:5002' ));
// app.use('/notification',proxy('http://localhost:5003' ));

// Error 

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT , ()=>{
    console.log(`API Gateway running at http://localhost:${PORT}`);
})


