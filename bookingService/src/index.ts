import express,{Application , Request ,Response} from "express"
import cookieParser from 'cookie-parser';
import connectDB from "./config/db"
import cors from 'cors'
import morgan from 'morgan'
import consume from "./config/kafka/consumer";
import doctorRoutes from "./routes/doctorRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import dotenv from "dotenv";

if (process.env.ENV_MODE === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}
consume()

let app:Application=express()
const PORT:number=Number(process.env.port)||5005

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions))
app.options("*", cors(corsOptions)); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.use('/doctor',doctorRoutes)
app.use('/patient',userRoutes)
app.use('/admin',adminRoutes)

app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});

const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`\nThe ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()