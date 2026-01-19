import { Router } from "express";
import { createNewWorkspace, getUsersAllWorkspace, getWorkspaceById,  } from "../controllers/workspace.controller.js";


const workspaceRoutes = Router();

workspaceRoutes.post("/create/new",createNewWorkspace);
workspaceRoutes.get("/all",getUsersAllWorkspace);
workspaceRoutes.get("/:id", getWorkspaceById);

export default workspaceRoutes;