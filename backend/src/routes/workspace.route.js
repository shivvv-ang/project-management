import { Router } from "express";
import { createNewWorkspace, deleteWorkspaceById, getUsersAllWorkspace, getWorkspaceAnalytics, getWorkspaceById, getWorkspaceMembers, updateWorkspaceById, updateWorkspaceMemberRole,} from "../controllers/workspace.controller.js";


const workspaceRoutes = Router();

workspaceRoutes.post("/",createNewWorkspace);
workspaceRoutes.get("/",getUsersAllWorkspace);
workspaceRoutes.get("/:workspaceId", getWorkspaceById);
workspaceRoutes.get("/:workspaceId/members", getWorkspaceMembers);
workspaceRoutes.put(
    "/:workspaceId/member/:memberId/role",
  updateWorkspaceMemberRole
  );
workspaceRoutes.put("/:workspaceId", updateWorkspaceById);
workspaceRoutes.delete("/:workspaceId", deleteWorkspaceById);
workspaceRoutes.get("/:workspaceId/analytics", getWorkspaceAnalytics);

export default workspaceRoutes;