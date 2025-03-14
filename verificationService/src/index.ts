import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'
import morgan from 'morgan'

import verificationRoutes from "./routes/verificationRoutes";

config();

let app:Application=express()
const PORT:number=Number(process.env.port)||5004

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))

app.use('/doctor',verificationRoutes)

app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});

const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()