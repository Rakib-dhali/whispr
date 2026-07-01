import { Router } from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesById,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const messageRoutes = Router();

messageRoutes.use(protectedRoute);

messageRoutes.get("/contacts", getAllContacts);
messageRoutes.get("/chat-partners", getChatPartners);
messageRoutes.get("/:id", getMessagesById);
messageRoutes.post("/send/:id", sendMessage);

export default messageRoutes;
