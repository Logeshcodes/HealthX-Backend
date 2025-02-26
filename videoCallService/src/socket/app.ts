import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Server, Socket } from "socket.io";
import UserModel from "../models/userModel";



// Type-safe users tracking
interface OnlineUser {
    userId: string;
    socketId: string;
   
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

    public addUser(userId: string, socketId: string): void {
        this.onlineUsers.set(userId, { userId, socketId });
    }

    public removeUser(socketId: string): void {
        for (const [userId, user] of this.onlineUsers.entries()) {
            if (user.socketId === socketId) {
                this.onlineUsers.delete(userId);
                break;
            }
        }
    }

    public getUserSocketId(userId: string): string | undefined {
        return this.onlineUsers.get(userId)?.socketId;
    }
}










function extractToken(socket: Socket): string {

    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    let token = cookies?.token || socket.handshake.auth?.token;
  
    if (!token) {
      throw new Error("No authentication token provided");
    }
  
    return token;
  }


function initializeSocketIO(io: Server) {
    const socketManager = SocketManager.getInstance();
  
    io.use(async (socket: Socket, next) => {
      try {
        // Extract token from multiple sources
        const token = extractToken(socket);
        console.log("token extracted from the message service");
        // Validate token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new Error("JWT Secret not configured");
        }
  
        const decodedToken: any = jwt.verify(token, JWT_SECRET);

        const email : string = decodedToken?.email ;
        const user = await UserModel.findOne({email});
  
        if (!user) {
          throw new Error("User not found");
        }
  
        // Attach user to socket for further use
        socket.data.user = user;
        next();
      } catch (error: any) {
        next(new Error(error.message || "Authentication failed"));
      }
    });
  
    io.on("connection", (socket: Socket) => {
       
      const user = socket.data.user;
      const userId = String(user._id);
  
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
  
      // Emit connection event
     
     
      // Enhanced WebRTC Call Handling
      // Initiate Outgoing Call
      socket.on(
        "outgoing:call",
        (data: { fromOffer: any; to: string; callType?: "video" | "audio" }) => {
          const { fromOffer, to, callType = "video" } = data;
          const recipientSocketId = socketManager.getUserSocketId(to);

          if (!recipientSocketId) {
            socket.emit("call:error", {
                message: `User ${data.to} is not online`,
                code: "USER_OFFLINE",
            });
            return;
        }
  
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("incoming:call", {
              from: socket.id,
              offer: fromOffer,
              caller: userId,
              callType,
              callerInfo: {
                name: user.name,
                avatar: user.avatar,
              },
            });
          } else {
            console.log(`User ${to} is not online`);
  
            socket.emit("call:error", {
              message: `User ${to} is not online`,
              code: "USER_OFFLINE",
            });
          }
        }
      );
  
      // Handle Call Acceptance
      socket.on(
        "call:accepted",
        (data: { answer: any; to: string; callType?: "video" | "audio" }) => {
          const { answer, to, callType = "video" } = data;
     
          io.to(to).emit("incoming:answer", {
            offer: answer,
            caller: userId,
            callType,
          });
        }
      );
  
      // ICE Candidate Exchange
      socket.on("ice:candidate", (data: { candidate: any; to: string }) => {
        const { candidate, to } = data;
        const recipientSocketId = socketManager.getUserSocketId(to);
  
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("ice:candidate", {
            candidate,
            from: socket.id,
            sender: userId,
          });
        }
      });
  
      // Add to your socket.io server code
      socket.on(
        "media:state:change",
        (data: { to: string; isAudioMuted?: boolean; isVideoOff?: boolean }) => {
          const recipientSocketId = socketManager.getUserSocketId(data.to);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("remote:media:state", {
              isAudioMuted: data.isAudioMuted,
              isVideoOff: data.isVideoOff,
            });
          }
        }
      );
  
      // Call Rejection
      socket.on("call:rejected", (data: { to: string; reason?: string }) => {
        const { to, reason } = data;
        const recipientSocketId = socketManager.getUserSocketId(to);
  
        if (recipientSocketId) {
          // Changed to emit to the specific socket instead of the room
          socket.to(recipientSocketId).emit("call:rejected", {
            from: userId, // Changed from socket.id to userId for consistency
            reason: reason || "Call rejected",
          });
        }
      });
  
      socket.on("call:canceled", (data: { to: string }) => {
        const { to } = data;
        const recipientSocketId = socketManager.getUserSocketId(to);
  
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("call:canceled", {
            from: socket.id,
          });
        }
      });
  
      // Additional WebRTC signaling events
      socket.on("call:missed", (data: { to: string }) => {
        const { to } = data;
        const recipientSocketId = socketManager.getUserSocketId(to);
  
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("call:missed", {
            from: socket.id,
            caller: userId,
          });
        }
      });
  
      socket.on("end:call", (data) => {
        // Forward the end call event to the recipient
        io.to(data.to).emit("call:ended", {
          from: data.from,
        });
      });


      // Handle disconnection
    socket.on("disconnect", () => {
        socketManager.removeUser(socket.id);
        console.log(`User ${userId} disconnected`);
    });
  
     
    });
  }


  const emitSocketEvent = (
    req: any,
    roomId: string,
    event: string,
    payload: any
  ): void => {
    const io: Server = req.app.get("io");
    io.in(roomId).emit(event, payload);
  };



  export { initializeSocketIO, emitSocketEvent, SocketManager };