import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import consume from "./config/kafka/consumer";
import doctorRoutes from "./routes/doctorRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import morgan from "morgan";

config();

let app: Application = express();
const PORT: number = Number(process.env.PORT) || 5002;

// ✅ CORS Fix
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight fix

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Improved Logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

// Routes
app.use("/patient", userRoutes); 
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);

consume();

// ✅ Improved Error Handling
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

// ✅ Ensure DB Connection Before Starting
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
