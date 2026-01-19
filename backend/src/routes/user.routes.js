import {Router} from "express";
import { getCurrentUser } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/current",getCurrentUser);

export default userRoutes;