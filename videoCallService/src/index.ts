import express,{Application,  NextFunction, Request, Response } from "express"
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDB from "./config/db";
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocketIO } from "./socket/app";
import registerSocketHandlers from "./socket/socketHandlers";
import morgan from 'morgan'
import videoCallRoutes from "./routers/videoCallRoutes";


config()

let app:Application=express()
const httpServer = createServer(app);
const PORT:number=Number(process.env.port)||5006


const io = new Server(httpServer, {
    cors: {
      origin: String(process.env.FRONTEND_URL),
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ['websocket', 'polling'], 
    pingTimeout: 60000, 
    pingInterval: 25000, 
    connectTimeout: 5000, 
    allowEIO3: true, 
  });

  const corsOptions = {
    origin: String(process.env.FRONTEND_URL),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.use('/',videoCallRoutes)



try {
    initializeSocketIO(io) ;
    console.log('Socket handlers initializeSocketIO successfully');
  } catch (error) {
    console.error('Failed to initializeSocketIO socket handlers:', error);
  }



  try {
    registerSocketHandlers(io);
    console.log('Socket handlers registered successfully');
  } catch (error) {
    console.error('Failed to register socket handlers:', error);
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`LOGGING 📝 : ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The ${process.env.SERVICE} is listening on port ${PORT}`);
    });
};
start()