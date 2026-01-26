import { Router } from "express";
import { createProject, getAllProjectsInWorkspace } from "../controllers/project.controller.js";

const projectRoutes = Router();

projectRoutes.post("/:workspaceId/create", createProject);

projectRoutes.get("/:workspaceId/all", getAllProjectsInWorkspace);



export default projectRoutes;