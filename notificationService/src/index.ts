import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import consume from "./config/kafka/consumer";

config(); 

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5003;
const FRONTEND_URL: string = process.env.FRONTEND_URL || "http://localhost:3000";


console.log("Environment Variables:", { PORT, FRONTEND_URL });


const corsOptions = {
  origin: FRONTEND_URL, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use((req, res, next) => {
  console.log(`📝 LOG: ${req.method} request to ${req.originalUrl}`);
  next();
});


consume();


app.get("/test-cors", (req: Request, res: Response) => {
  res.json({ message: "CORS is working!" });
});

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.json("Notification service is running 🚀");
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(" Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});
