import express, { Application } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import consume from "./config/kafka/consumer";
import doctorRoutes from "./routes/doctorRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import morgan from "morgan";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

let app: Application = express();
const PORT: number = Number(process.env.PORT) || 5002;


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

app.use("/patient", userRoutes); 
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/review", reviewRoutes);

consume();

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});


const userStart = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`${process.env.SERVICE} is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

userStart();
