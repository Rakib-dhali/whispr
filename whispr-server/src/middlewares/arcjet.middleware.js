import aj from "../lib/arcjet.js";
import {isSpoofedBot} from "@arcjet/inspect"

export const ajProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({message: "rate limit exceeded"})
      } else if (decision.reason.isBot()) {
        return res.status(403).json({message: "No bots allowed"})
      } else {
        return res.status(403).json({message: "Forbidden"})
      }
    }

    if (decision.results.some(isSpoofedBot)){
      return res.status(403).json({message: "Spoofed bot detected"})
    }

    next();
  } catch (error) {
    console.log("AJ Protection Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
