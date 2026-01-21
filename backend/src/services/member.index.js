import mongoose from "mongoose";
import { ErrorCodeEnum } from "../enum/error-code.enum.js";
import Member from "../models/member.model.js";
import { BadRequestException, UnAuthorizedException } from "../utils/appError.js";
import Workspace from "../models/workspace.model.js";
import { Roles } from "../enum/role-permission.enum.js";
import Role from "../models/roles-permissions.model.js";

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

export const joinWorkspaceByInviteService = async (userId, inviteCode) => {

    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
    }

    const existingMember = await Member.findOne({
        userId,
        workspace: workspace._id,
    }).exec();

    if (existingMember) {
        throw new BadRequestException("You are already a member of this workspace");
    }

    const role = await Role.findOne({ name: Roles.MEMBER });

    if (!role) {
        throw new NotFoundException("Role not found");
    }

    const newMember = new Member({
        userId,
        workspace: workspace._id,
        role: role._id,
    });

    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
}