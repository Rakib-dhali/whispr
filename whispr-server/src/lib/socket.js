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

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.fullName);

  const userId = socket.user._id.toString();
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Persist last active time to DB
    try {
      await User.findByIdAndUpdate(userId, { lastActive: new Date() });
    } catch (err) {
      console.error("Failed to update lastActive:", err);
    }
  });
});

export { io, app, server };
