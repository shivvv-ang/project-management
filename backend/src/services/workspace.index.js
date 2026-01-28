import mongoose from "mongoose";
import { Roles } from "../enum/role-permission.enum.js";
import Member from "../models/member.model.js";
import Role from "../models/roles-permissions.model.js";
import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import Project from "../models/project.model.js";
import { BadRequestException, NotFoundException } from "../utils/appError.js";
import Task from "../models/task.model.js";
import { TaskStatusEnum } from "../enum/task.enum.js";


export const createWorkspaceService = async (userId, body) => {
    const { name, description } = body;

    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundException("User Not Found");
    }

    const ownerRole = await Role.findOne({ name: Roles.OWNER });

    if (!ownerRole) {
        throw new NotFoundException("owner role found");
    }

    const workspace = new Workspace({
        name: name,
        description: description,
        owner: user._id
    });

    await workspace.save();

    const member = new Member({
        userId: user._id,
        workspace: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date()
    })

    await member.save();

    user.currentWorkspace = workspace._id
    await user.save();

    return {
        workspace
    }
}


export const getUserWorkspacesService = async (userId) => {

    const memberships = await Member.find({ userId }).populate("workspace").exec();

    const workspaces = memberships.map((membership) => membership.workspace);

    return { workspaces };
}

export const getWorkspaceByIdService = async (workspaceId) => {

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        throw new BadRequestException("Invalid workspace id");
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const members = await Member.find({ workspace: workspaceId }).populate("role");

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members
    }

    return { workspace: workspaceWithMembers };
};


export const getWorkspaceMembersService = async (workspace) => {

    if (!mongoose.Types.ObjectId.isValid(workspace)) {
        throw new BadRequestException("Invalid workspace id");
    }

    const members = await Member.find({ workspace })
        .populate("userId", "name email profilePicture")
        .populate("role", "name");

    return { members };
}

export const getWorkspaceAnalyticsService = async (workspace) => {

    const currentDate = new Date();

    const totalTasks = await Task.countDocuments({
        workspace,
    });

    const overdueTasks = await Task.countDocuments({
        workspace,
        dueDate: { $lt: currentDate },
        status: { $ne: TaskStatusEnum.DONE },
    });

    const completedTasks = await Task.countDocuments({
        workspace,
        status: TaskStatusEnum.DONE,
    });

    const analytics = {
        totalTasks,
        overdueTasks,
        completedTasks,
    };

    return { analytics };
}


export const updateWorkspaceMemberRoleService
    = async (workspaceId, memberId, roleId) => {

        const isValidIds = [workspaceId, memberId, roleId].every((id) =>
            mongoose.Types.ObjectId.isValid(id)
        );

        if (!isValidIds) {
            throw new BadRequestException("Invalid id provided");
        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            throw new NotFoundException("Role not found");
        }

        const member = await Member.findOne({
            userId: memberId,
            workspace: workspaceId,
        });

        if (!member) {
            throw new Error("Member not found in the workspace");
        }

        member.role = role;
        await member.save();

        return {
            member,
        };
    }

export const updateWorkspaceService = async (workspaceId, name, description) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    return {
        workspace,
    };
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const workspace = await Workspace.findById(workspaceId).session(
            session
        );
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }


        if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
            throw new BadRequestException(
                "You are not authorized to delete this workspace"
            );
        }

        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        await Project.deleteMany({ workspace: workspace._id }).session(
            session
        );

        await Task.deleteMany({ workspace: workspace._id }).session(session);

        await Member.deleteMany({
            workspace: workspace._id,
        }).session(session);


        if (user?.currentWorkspace?.equals(workspaceId)) {
            const memberWorkspace = await Member.findOne({ userId }).session(
                session
            );

            user.currentWorkspace = memberWorkspace
                ? memberWorkspace.workspace
                : null;

            await user.save({ session });
        }

        await workspace.deleteOne({ session });

        await session.commitTransaction();

        session.endSession();

        return {
            currentWorkspace: user.currentWorkspace,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};