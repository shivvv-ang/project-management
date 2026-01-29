import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controllers/task.controller.js";


const taskRoutes = Router();

taskRoutes.post(
    " /workspace/:workspaceId/project/:projectId/task",
    createTask
);

taskRoutes.delete("/workspace/:workspaceId/task/:taskId", deleteTask);

taskRoutes.put(
    " /workspace/:workspaceId/project/:projectId/task/:taskId",
    updateTask
);

taskRoutes.get(" /workspace/:workspaceId/task", getAllTasks);

taskRoutes.get(
    "/workspace/:workspaceId/project/:projectId/task/:taskId",
    getTaskById
);

export default taskRoutes;