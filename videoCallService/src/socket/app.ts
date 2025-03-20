import * as cookie from 'cookie';
import dotenv from "dotenv";
import { verifyToken } from './verify';
dotenv.config();

import { Server, Socket } from "socket.io";
import userCollection from "../models/userModel";
import doctorCollection from "../models/doctorModel";

interface OnlineUser {
  id: string;
  userId: string;
  socketId: string;
  lastActive: number;
}

interface DecodedToken {
  email: string;
  role: string;
  [key: string]: any;
}

class SocketManager {
  private static instance: SocketManager;
  private onlineUsers: Map<string, OnlineUser> = new Map();

  private constructor() {
    // Clean up inactive users every 30 minutes
    setInterval(() => this.cleanupInactiveUsers(), 1000 * 60 * 30);
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public addUser(id: string, userId: string, socketId: string): void {
    this.onlineUsers.set(userId, {
      id,
      userId,
      socketId,
      lastActive: Date.now(),
    });
  }

  public removeUser(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  public getUserSocketId(userId: string): string | undefined {
    return this.onlineUsers.get(userId)?.socketId;
  }

  public getUserSocketIdByUserId(email: string): OnlineUser | undefined {
    return this.onlineUsers.get(email);
  }

  public getAllOnlineUsers(): OnlineUser[] {
    return Array.from(this.onlineUsers.values());
  }

  private cleanupInactiveUsers(maxInactivityTime = 1000 * 60 * 30): void {
    const now = Date.now();
    this.onlineUsers.forEach((user, userId) => {
      if (now - user.lastActive > maxInactivityTime) {
        this.onlineUsers.delete(userId);
      }
    });
  }
}

async function initializeSocketIO(io: Server) {
  console.log("Initializing Socket.IO");
  const socketManager = SocketManager.getInstance();

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = extractToken(socket);
      const JWT_SECRET = process.env.JWT_SECRET || "mySecertPassword";
      if (!JWT_SECRET) {
        throw new Error("JWT Secret not configured");
      }
  
      const decodedToken = await verifyToken(token) as DecodedToken;
      if (!decodedToken?.email || !decodedToken?.role) {
        throw new Error("Invalid or malformed token");
      }
  
      let entity;
      if (decodedToken.role === "User") {
        entity = await userCollection.findOne({ email: decodedToken.email });
      } else if (decodedToken.role === "Doctor") {
        entity = await doctorCollection.findOne({ email: decodedToken.email });
      } else {
        throw new Error("Invalid role in token");
      }
  
      if (!entity) {
        throw new Error("Entity not found");
      }
  
      socket.data.entity = entity;
      socket.data.email = decodedToken.email;
      next();
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      next(new Error(error.message || "Authentication failed"));
    }
  });
  
  // Main connection handler
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Add user to online users
    socketManager.addUser(
      String(socket.data.entity._id), 
      socket.data.entity.email, 
      socket.id
    );
  
    // Initiate outgoing call
    socket.on("outgoing:call", (data) => {
      const { to, fromOffer } = data;
      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      
      if (!recipientSocketId) {
        socket.emit("call:error", { 
          message: `User ${to} is not online`, 
          code: "USER_OFFLINE" 
        });
        return;
      }
  
      // Send incoming call to recipient
      io.to(recipientSocketId.socketId).emit("incoming:call", { 
        from: socket.data.email,  // Send caller's email
        offer: fromOffer, 
        userEmail: recipientSocketId.userId 
      });
    });
  
    // Handle call acceptance
    socket.on("call:accepted", (data) => {
      const { to, answer } = data;
      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      
      if (recipientSocketId) {
        io.to(recipientSocketId.socketId).emit("incoming:answer", { 
          from: socket.data.email,  // Send caller's email
          answer 
        });
      }
    });
  
    // Handle ICE candidate exchange
    socket.on("ice:candidate", (data) => {
      const { to, candidate } = data;
      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      
      if (recipientSocketId) {
        io.to(recipientSocketId.socketId).emit("ice:candidate", { 
          from: socket.data.email,  // Send sender's email
          candidate 
        });
      }
    });
  
    // Handle call termination
    socket.on("end:call", (data) => {
      const { to } = data;
      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      
      if (recipientSocketId) {
        io.to(recipientSocketId.socketId).emit("call:ended", { 
          from: socket.data.email  // Send terminator's email
        });
      }
    });
  
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socketManager.removeUser(socket.data.entity.email);
    });
  });
  }
  
  // Token extraction utility
  function extractToken(socket: Socket): string {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    
    // Check for different access tokens based on role
    const token = 
      cookies.accessToken || 
      socket.handshake.auth?.token || 
      cookies.accessToken1 ||  // Patient token
      cookies.accessToken2;    // Doctor token
  
    if (!token) {
      throw new Error("No authentication token provided");
    }
    return token;
  }
  
  export { initializeSocketIO, SocketManager };