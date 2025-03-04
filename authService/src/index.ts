import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db";
import userRoutes from "./routers/userRouters";
import doctorRoutes from "./routers/doctorRouters";
import adminRoutes from "./routers/adminRouters";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import consume from "./config/kafka/consumer";

config(); 

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5001;
const FRONTEND_URL: string = process.env.FRONTEND_URL || "http://localhost:3000";
const SERVICE: string = process.env.SERVICE || "Auth Service";


console.log("Environment Variables:", { PORT, FRONTEND_URL, SERVICE });


const corsOptions = {
  origin: FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use((req, res, next) => {
  console.log(`📝 LOG: ${req.method} request to ${req.originalUrl}`);
  next();
});


app.use("/user", userRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);



consume();

app.use(ErrorMiddleware);

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error(" Unhandled Rejection:", reason);
  process.exit(1);
});


const startAuthService = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` ${SERVICE} is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startAuthService();
