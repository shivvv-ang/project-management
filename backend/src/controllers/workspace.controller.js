import { HTTPSTATUS } from "../configs/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { createWorkspaceService, getAllWorkspaceUserisMemberService, getWorkspaceByIdService } from "../services/workspace.index.js";
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

    await getMemberRoleinWorkspace(user,workspaceId);

    const {workspace} = await getWorkspaceByIdService (workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        data: workspace,
    });
})