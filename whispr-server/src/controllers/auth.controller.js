import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail, sendLoginEmail } from "../lib/email.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, fullName).catch((err) =>
        console.error("Failed to send welcome email:", err),
      );
      generateToken(user._id, res);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    // Send login notification email (non-blocking)
    sendLoginEmail(email, user.fullName).catch((err) =>
      console.error("Failed to send login email:", err),
    );

    return res.status(200).json({
      message: "User signed in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "signed out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    if (!fullName && !profilePic) {
      return res
        .status(400)
        .json({ message: "At least one feild is required" });
    }

    const userId = req.user._id;
    const updates = {};

    if (typeof fullName === "string" && fullName.trim()) {
      updates.fullName = fullName.trim();
    }

    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic);
      updates.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User is logged in",
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        profilePic: req.user.profilePic,
      },
    });
  } catch (error) {
    console.error("checkUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
