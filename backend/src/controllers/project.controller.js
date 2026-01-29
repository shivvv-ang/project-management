import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { roleGuard } from "../utils/roleGuard.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validation.js";
import { Permissions } from "../enum/role-permission.enum.js";
import { createProjectInWorkspaceService, deleteProjectService, getProjectAnalyticsService, getProjectByIdInWorkspaceService, getProjectsInWorkspaceService, updateProjectInWorkspaceService } from "../services/project.index.js";
import { HTTPSTATUS } from "../configs/http.config.js";

export const createProject = asyncHandler(async (req, res) => {

    const body = createProjectSchema.parse(req.body);
    const { workspaceId } = req.params;
    const userId = req?.user?._id;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectInWorkspaceService(userId, workspaceId, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project Created Successfully",
        project
    })
});


export const getAllProjectsInWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const userId = req?.user?._id;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.VIEW_ONLY]);

    const PageSize = parseInt(req.query.PageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const { projects, totoalDocs, totalPages, skip } = await getProjectsInWorkspaceService(workspaceId, PageSize, pageNumber);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project Fetched Successfully",
        projects,
        pagination: {
            totoalDocs,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: PageSize
        }
    })
})

export const getProjectInWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { projectId } = req.params;
    const userId = req.user?._id;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdInWorkspaceService(workspaceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project Fetched Successfully",
        project
    })
});

export const getProjectAnalytics = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { projectId } = req.params;
    const userId = req.user?._id;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsService(workspaceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
        "message": "Analytics Fetched Successfully",
        analytics
    })
});


export const updateProject = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;

        const body = updateProjectSchema.parse(req.body);

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.EDIT_PROJECT]);

        const { project } = await updateProjectInWorkspaceService(
            workspaceId,
            projectId,
            body
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Project updated successfully",
            project,
        });
    }
);

export const deleteProject = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.DELETE_PROJECT]);

        await deleteProjectService(workspaceId, projectId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Project deleted successfully",
        });
    }
);