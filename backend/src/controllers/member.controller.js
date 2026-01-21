
import { z } from "zod";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { HTTPSTATUS } from "../configs/http.config.js";
import { joinWorkspaceByInviteService } from "../services/member.index.js";

export const joinWorkspace = asyncHandler(

    async (req, res) => {

        const inviteCode = z.string().parse(req.params.inviteCode);
        const userId = req?.user;

        const { workspaceId, role } = await joinWorkspaceByInviteService(
            userId,
            inviteCode
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Successfully joined the workspace",
            workspaceId,
            role,
        });
    }
);