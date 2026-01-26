import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { roleGuard } from "../utils/roleGuard.js";
import { createProjectSchema } from "../validators/project.validation.js";
import { Permissions } from "../enum/role-permission.enum.js";
import { createProjectService, getProjectsInWorkspaceService } from "../services/project.index.js";
import { HTTPSTATUS } from "../configs/http.config.js";

export const createProject = asyncHandler(async (req, res) => {

    const body = createProjectSchema.parse(req.body);
    const { workspaceId } = req.params;
    const userId = req.user;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project Created Successfully",
        project
    })
});


export const getAllProjectsInWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const userId = req.user;

    const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
    roleGuard(roleName, [Permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.PageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const { projects, totoalDocs, totalPages, skip } = await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project Fetched Successfully",
        projects,
        pagination: {
            totoalDocs,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize
        }
    })
})