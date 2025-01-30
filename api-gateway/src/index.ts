import express, { Application , Request ,Response , NextFunction } from 'express'
import cors from 'cors'                                                
import { config } from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware'

import proxy = require('express-http-proxy')


config();

const app : Application = express()

const {PORT ,  FRONTEND_URL , AUTH_URL , USER_URL } = process.env

console.log("Environment Variables:", { PORT, FRONTEND_URL, AUTH_URL });

const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// Middleware

app.use(cors(corsOptions));

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
    // {
    //     path: NOTIFICATION_URL, // Target service URL
    //     context: "/notification", // Route on your gateway
    // },
    // {
    //     path: VERIFICATION_URL, // Target service URL
    //     context: "/verification", // Route on your gateway
    // },
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



app.use('/auth',proxy('http://localhost:5001' ));
app.use('/user',proxy('http://localhost:5002' ));

// Error 

app.use((err: Error, req:Request, res:Response, next:NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT , ()=>{
    console.log(`API Gateway running at http://localhost:${PORT}`);
})


