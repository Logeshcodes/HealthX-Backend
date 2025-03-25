import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/app";
import morgan from "morgan";
import videoCallRoutes from "./routers/videoCallRoutes";
import consume from "./config/kafka/consumer";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

consume();

const app: Application = express();
const httpServer = createServer(app);

const PORT: number = Number(process.env.PORT) || 5006;
const FRONTEND_URL = process.env.FRONTEND_URL ;
const SERVICE = process.env.SERVICE || "Video Call Service";



const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};


app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Initialize Socket.IO

const io = new Server(httpServer, {
  path: '/socket.io',
  cors: {
    origin: String(process.env.FRONTEND_URL) || "https://healthx.live",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

try {
  initializeSocketIO(io);
  console.log(" Socket.IO initialized successfully.");
} catch (error) {
  console.error(" Failed to initialize Socket.IO:", error);
}

// Routes
app.use("/", videoCallRoutes);

// Health Check Endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", service: SERVICE, timestamp: new Date() });
});

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`📝 LOG: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Graceful Error Handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error(" Unhandled Rejection:", reason);
  process.exit(1);
});

// Start the Service
const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(` ${SERVICE} is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting the server:", error);
    process.exit(1);
  }
};

start();
