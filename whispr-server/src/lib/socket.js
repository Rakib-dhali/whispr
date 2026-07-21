import express from "express";
import http from "http";
import { Server } from "socket.io";
import { socketIoMiddleware } from "../middlewares/socket.middleware.js";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketIoMiddleware);

const userSocketMap = {}; // { userId: string[] }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.fullName);

  const userId = socket.user._id.toString();
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }
  userSocketMap[userId].push(socket.id);
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.user.fullName);
    
    const userSockets = userSocketMap[userId];
    if (userSockets) {
      userSocketMap[userId] = userSockets.filter((id) => id !== socket.id);
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
        
        // Persist last active time to DB only when all connections are closed
        try {
          await User.findByIdAndUpdate(userId, { lastActive: new Date() });
        } catch (err) {
          console.error("Failed to update lastActive:", err);
        }
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

  });
});

export { io, app, server };
