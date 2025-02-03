import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors'

import connectDB from "./config/db"
import morgan from 'morgan'
import userRoutes from './routers/userRouters';
import doctorRoutes from './routers/doctorRouters' ;
import adminRoutes from './routers/adminRouters' ;
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';


import consume from "./config/kafka/consumer";

config()

const app : Application = express();

const {PORT ,  FRONTEND_URL , SERVICE } = process.env


const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

const morganFormat = ':method :url :status :response-time ms';

// logger

app.use(morgan('dev'));

// Middleware

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser()) ;
app.use(ErrorMiddleware) ;


// routes

app.use('/user', userRoutes)
app.use('/doctor', doctorRoutes)
app.use('/admin', adminRoutes)

consume()


const authStart = async () => {
    try {
      await connectDB(); 

      app.listen(PORT, () => {
        console.log(`${SERVICE} is listening on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error starting the server:', error);
      process.exit(1); 
    }
  };


  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
  

authStart()