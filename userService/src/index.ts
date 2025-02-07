import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'

import consume from "./config/kafka/consumer";
import doctorRoutes from "./routes/doctorRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

import morgan from 'morgan'

config()

let app:Application=express()
const PORT:number=Number(process.env.PORT) || 5002 ;


const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))

app.use('/patient' , userRoutes)  // change /user
app.use('/doctor' , doctorRoutes)
app.use('/admin' , adminRoutes)

consume()


const morganFormat = ':method :url :status :response-time ms';

app.use(morgan('dev'));


const userStart = async () => {
    try {
      await connectDB(); 

      app.listen(PORT, () => {
        console.log(`${process.env.SERVICE} is listening on port ${process.env.PORT}`);
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
  

userStart()