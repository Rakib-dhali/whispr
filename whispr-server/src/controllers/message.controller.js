import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const senderId = req.user._id;
    const contacts = await User.find({ _id: { $ne: senderId } }).select(
      "-password",
    );
    return res.status(200).json({
      message: "contacts fetched successfully",
      contacts,
    });
  } catch (error) {
    console.error("getAllContacts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesById = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "messages fetched successfully",
      messages,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    // send message in real time is uer is online socket.io

    res.status(201).json({
      message: "Message sent successfully",
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const chatPartnerIds = messages.map((message) => {
      if (message.senderId.toString() === userId.toString()) {
        return message.receiverId;
      } else {
        return message.senderId;
      }
    });

    const uniquePartners = [...new Set(chatPartnerIds.map((id) => id.toString()))];
    const users = await User.find({ _id: { $in: uniquePartners } }).select(
      "-password",
    );

    res.status(200).json({
      message: "Chat partners fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error in getChatPartners controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
