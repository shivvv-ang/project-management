import mongoose from "mongoose";
import { ErrorCodeEnum } from "../enum/error-code.enum.js";
import Member from "../models/member.model.js";
import { BadRequestException, UnAuthorizedException } from "../utils/appError.js";

export const getMemberRoleinWorkspace = async (userId, workspaceId) => {

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        throw new BadRequestException("Invalid workspace id");
    }

    const member = await Member.findOne({ userId, workspace: workspaceId }).populate("role");

    if (!member) {
        throw new UnAuthorizedException("you are not authorized member", ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const roleName = member.role?.name;

    return { roleName };
}