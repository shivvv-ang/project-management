import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controllers/task.controller.js";


const taskRoutes = Router();

taskRoutes.post(
    "/:projectId/:workspaceId/create",
    createTask
);

taskRoutes.delete("/:taskId/:workspaceId/delete", deleteTask);

taskRoutes.put(
    "/:taskId/:projectId/:workspaceId/update",
    updateTask
);

taskRoutes.get("/:workspaceId/all", getAllTasks);

taskRoutes.get(
    "/:taskId/:projectId/:workspaceId",
    getTaskById
);

export default taskRoutes;