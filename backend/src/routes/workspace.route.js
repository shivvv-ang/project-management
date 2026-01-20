import { Router } from "express";
import { changeWorkspaceMemberRole, createNewWorkspace, getUsersAllWorkspace, getWorkspaceAnalytics, getWorkspaceById, getWorkspaceMembers,} from "../controllers/workspace.controller.js";


const workspaceRoutes = Router();

workspaceRoutes.post("/create/new",createNewWorkspace);
workspaceRoutes.get("/all",getUsersAllWorkspace);
workspaceRoutes.get("/:workspaceId/members", getWorkspaceMembers);
workspaceRoutes.get("/:workspaceId", getWorkspaceById);
workspaceRoutes.get("/:workspaceId/analytics", getWorkspaceAnalytics);
workspaceRoutes.put(
    "/:workspaceId/change/member/role",
    changeWorkspaceMemberRole
  );

export default workspaceRoutes;