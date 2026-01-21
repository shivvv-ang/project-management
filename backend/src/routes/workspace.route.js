import { Router } from "express";
import { changeWorkspaceMemberRole, createNewWorkspace, deleteWorkspaceById, getUsersAllWorkspace, getWorkspaceAnalytics, getWorkspaceById, getWorkspaceMembers, updateWorkspaceById,} from "../controllers/workspace.controller.js";


const workspaceRoutes = Router();

workspaceRoutes.post("/create/new",createNewWorkspace);
workspaceRoutes.put("/update/:workspaceId", updateWorkspaceById);
workspaceRoutes.get("/all",getUsersAllWorkspace);
workspaceRoutes.get("/:workspaceId/members", getWorkspaceMembers);
workspaceRoutes.get("/:workspaceId", getWorkspaceById);
workspaceRoutes.get("/:workspaceId/analytics", getWorkspaceAnalytics);
workspaceRoutes.put(
    "/:workspaceId/change/member/role",
    changeWorkspaceMemberRole
  );

workspaceRoutes.delete("/delete/:workspaceId", deleteWorkspaceById);


export default workspaceRoutes;