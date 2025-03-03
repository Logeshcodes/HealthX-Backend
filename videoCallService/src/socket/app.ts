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

class SocketManager {
  private static instance: SocketManager;
  private onlineUsers: Map<string, OnlineUser> = new Map();

  private constructor() {}

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
    setInterval(() => this.cleanupInactiveUsers(), 1000 * 60 * 30);
  }

  public removeUser(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  public getUserSocketId(userId: string): string | undefined {
    return this.onlineUsers.get(userId)?.socketId;
  }

  public getUserSocketIdByUserId(email: string): any {
    const data = this.onlineUsers.get(email);
    console.log(this.onlineUsers, data, "fun");
    return data;
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
  console.log("Entered socket initialization");
  const socketManager = SocketManager.getInstance();

  io.use(async (socket: Socket, next) => {
    console.log(socketManager.getAllOnlineUsers(), "All online users here");
    try {
      const token = extractToken(socket);

      const JWT_SECRET = 'mySecertPassword';
      if (!JWT_SECRET) {
        throw new Error("JWT Secret not configured");
      }

      const decodedToken: any = await verifyToken(token);

      if (!decodedToken || !decodedToken.email || !decodedToken.role) {
        throw new Error("Invalid or malformed token");
      }

      console.log("Decoded token:", decodedToken?.email);
      console.log("Role:", decodedToken?.role);

      let entity;
      if (decodedToken?.role === "User") {
        entity = await userCollection.findOne({ email: decodedToken?.email });
      } else if (decodedToken?.role === "Doctor") {
        entity = await doctorCollection.findOne({ email: decodedToken?.email });
      } else {
        throw new Error("Invalid role in token");
      }

      if (!entity) {
        throw new Error("Entity not found");
      }
      socket.data.entity = entity;
      next();
    } catch (error: any) {
      next(new Error(error.message || "Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socketManager.addUser(String(socket.data.entity._id), socket.data.entity.email, socket.id);

    socket.on("outgoing:call", (data) => {
      const { to, fromOffer } = data;

      console.log("Outgoing call from:", socket.id, "to:", to);

      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      console.log(recipientSocketId.socketId, "Recipient socket ID");
      if (!recipientSocketId) {
        console.log(`User ${to} is not online`);
        socket.emit("call:error", { message: `User ${to} is not online`, code: "USER_OFFLINE" });
        return;
      }

      io.to(recipientSocketId.socketId).emit("incoming:call", { from: socket.id, offer: fromOffer,userEmail:recipientSocketId.userId });
    });

    socket.on("call:accepted", (data) => {
      const { to, answer } = data;
      console.log("Call accepted by:", socket.id, "to:", to);

      const recipientSocketId = socketManager.getUserSocketIdByUserId(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("incoming:answer", { from: socket.id, answer });
      }
    });

    socket.on("ice:candidate", (data) => {
      const { to, candidate } = data;
      console.log("ICE candidate from:", socket.id, "to:", to);
      const recipientSocketId = socketManager.getUserSocketId(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("ice:candidate", { from: socket.id, candidate });
      }
    });

    socket.on("end:call", (data) => {
      const { to } = data;
      console.log("Call ended by:", socket.id, "to:", to);

      const recipientSocketId = socketManager.getUserSocketId(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call:ended", { from: socket.id });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socketManager.removeUser(socket.data.entity._id);
    });
  });
}

function extractToken(socket: Socket): string {
  try {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    let token = cookies.accessToken || socket.handshake.auth?.token;

    if (!token) {
      throw new Error("No authentication token provided");
    }
    return token;
  } catch (error) {
    throw new Error("Error extracting authentication token");
  }
}

export { initializeSocketIO, SocketManager };