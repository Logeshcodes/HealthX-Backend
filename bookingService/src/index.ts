import express,{Application , Request ,Response} from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db"
import cors from 'cors'

import morgan from 'morgan'

import consume from "./config/kafka/consumer";

import doctorRoutes from "./routes/doctorRoutes";
import userRoutes from "./routes/userRoutes";

config()

consume()


let app:Application=express()
const PORT:number=Number(process.env.port)||5005

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


app.use('/doctor',doctorRoutes)
app.use('/patient',userRoutes)



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