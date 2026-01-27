import { Router } from "express";
import { createProject, deleteProject, getAllProjectsInWorkspace, getProjectAnalytics, getProjectInWorkspace, updateProject } from "../controllers/project.controller.js";

const projectRoutes = Router();

projectRoutes.post("/:workspaceId/create", createProject);

projectRoutes.get("/:workspaceId/all", getAllProjectsInWorkspace);

projectRoutes.get("/:workspaceId/:projectId", getProjectInWorkspace);

projectRoutes.get("/:workspaceId/:projectId/analytics", getProjectAnalytics);

projectRoutes.put(
    "/:workspaceId/:projectId/update",
    updateProject
);

projectRoutes.delete(
    "/:workspaceId/:projectId/delete",
    deleteProject
);

export default projectRoutes;