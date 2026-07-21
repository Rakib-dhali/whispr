import { Router } from "express";
import { signup, signin, signout, updateProfile, checkUser } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { ajProtection } from "../middlewares/arcjet.middleware.js";

const authRoutes = Router();

authRoutes.use(ajProtection)

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/signout", signout);

authRoutes.patch("/update-profile", protectedRoute, updateProfile);
authRoutes.get("/checkUser", protectedRoute, checkUser );


export default authRoutes;
