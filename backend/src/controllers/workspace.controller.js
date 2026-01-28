import { HTTPSTATUS } from "../configs/http.config.js";
import { Permissions } from "../enum/role-permission.enum.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { createWorkspaceService, deleteWorkspaceService, getUserWorkspacesService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService, updateWorkspaceMemberRoleService, updateWorkspaceService } from "../services/workspace.index.js";
import { roleGuard } from "../utils/roleGuard.js";
import { createSchema, updateSchema } from "../validators/workspace.validation.js";

export const createNewWorkspace = asyncHandler(async (req, res) => {

    const body = createSchema.parse(req.body);

    const user = req?.user._id;

    const { workspace } = await createWorkspaceService(user, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "workspace created",
        workspace
    })

})

export const getUsersAllWorkspace = asyncHandler(async (req, res) => {
    const user = req?.user._id;

    const { workspaces } = await getUserWorkspacesService(user);

    return res.status(HTTPSTATUS.OK).json({
        message: "all user workspaces fetched successfully",
        workspaces,
    })
})


export const getWorkspaceById = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const user = req?.user._id;

    await getMemberRoleinWorkspace(user, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        data: workspace,
    });
})

export const getWorkspaceMembers = asyncHandler(async (req, res) => {

    const { workspaceId } = req.params;

    const { members } = await getWorkspaceMembersService(workspaceId);

    return res.status(200).json({
        message: "Members fetched",
        members,
    });
})


export const getWorkspaceAnalytics = asyncHandler(async (req, res) => {

    const { workspaceId } = req.params;

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully",
        analytics,
    });
})

export const updateWorkspaceMemberRole = asyncHandler(async (req, res) => {
    const { workspaceId, memberId } = req.params;

    const user = req?.user._id;

    const { roleId } = req.body;

    const { roleName } = await getMemberRoleinWorkspace(user, workspaceId);

    roleGuard(roleName, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await updateWorkspaceMemberRoleService(
        workspaceId,
        memberId,
        roleId
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Member Role changed successfully",
        member,
    });
});

export const updateWorkspaceById = asyncHandler(async (req, res) => {

    const { workspaceId } = req.params;

    updateSchema.parse(req.body);

    const { name, description } = req.body;

    const user = req?.user._id;

    const { roleName } = await getMemberRoleinWorkspace(user, workspaceId);

    roleGuard(roleName, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceService(
        workspaceId,
        name,
        description
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
    });

})

export const deleteWorkspaceById = asyncHandler(async (req, res) => {

    const { workspaceId } = req.params;

    const userId = req?.user._id;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
        workspaceId,
        userId
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
    });
})