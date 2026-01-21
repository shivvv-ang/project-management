import {Router} from "express";
import { joinWorkspace } from "../controllers/member.controller.js";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinWorkspace);

export default memberRoutes;