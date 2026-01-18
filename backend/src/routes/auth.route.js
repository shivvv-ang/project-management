import { Router } from "express";
import passport from "passport";
import { config } from "../configs/app.config.js";
import { googleLoginCallback, loginUser, logOutUser, registerUser } from "../controllers/auth.controller.js";

const authRoutes = Router();

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

authRoutes.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

authRoutes.get("/google/callback", passport.authenticate("google", {
    failureRedirect: failedUrl,
}),googleLoginCallback);


authRoutes.post("/register",registerUser);
authRoutes.post("/login",loginUser);
authRoutes.post("/logout", logOutUser);

export default authRoutes;