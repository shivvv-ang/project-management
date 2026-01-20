import { HTTPSTATUS } from "../configs/http.config.js";
import { Permissions } from "../enum/role-permission.enum.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { createWorkspaceService, getAllWorkspaceUserisMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMemberService } from "../services/workspace.index.js";
import { roleGuard } from "../utils/roleGuard.js";
import { createSchema } from "../validators/workspace.validation.js";

export const createNewWorkspace = asyncHandler(async (req, res) => {

    const body = createSchema.parse(req.body);

    const user = req?.user;

    const { workspace } = await createWorkspaceService(user, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "workspace created",
        workspace
    })

})

export const getUsersAllWorkspace = asyncHandler(async (req, res) => {
    const user = req?.user;

    const { workspaces } = await getAllWorkspaceUserisMemberService(user);

    return res.status(HTTPSTATUS.OK).json({
        message: "all user workspaces fetched successfully",
        workspaces,
    })
})


export const getWorkspaceById = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const user = req?.user;

    await getMemberRoleinWorkspace(user, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        data: workspace,
    });
})

export const getWorkspaceMembers = asyncHandler(async (req, res) => {

    const { workspaceId } = req.params;

    const { members } = await getWorkspaceMemberService(workspaceId);

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

export const changeWorkspaceMemberRole = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    
    const user = req?.user;

    const { memberId, roleId } = req.body;

    const { roleName } = await getMemberRoleinWorkspace(user, workspaceId);

    roleGuard(roleName, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
        workspaceId,
        memberId,
        roleId
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Member Role changed successfully",
        member,
    });
});