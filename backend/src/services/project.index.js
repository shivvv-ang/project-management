import mongoose from "mongoose";
import { TaskStatusEnum } from "../enum/task.enum.js";
import Project from "../models/project.model.js"
import Task from "../models/task.model.js";
import { NotFoundException } from "../utils/appError.js";

export const createProjectInWorkspaceService = async (userId, workspaceId, body) => {
    const project = new Project({
        ...(body.emoji && { emoji: body.emoji }),
        name: body.name,
        description: body.description,
        workspace: workspaceId,
        createdBy: userId
    })

    await project.save();

    return { project };
}

export const getProjectsInWorkspaceService = async (workspaceId, PageSize, pageNumber) => {
    const totoalDocs = await Project.countDocuments({ workspace: workspaceId });

    const skip = (pageNumber - 1) * PageSize;

    const projects = await Project.find({
        workspace: workspaceId
    }).skip(skip).limit(PageSize).populate("createdBy", "_id name profilePicture -password").sort({ createdAt: -1 });

    const totalPages = Math.ceil(totoalDocs / PageSize);

    return { projects, totoalDocs, totalPages, skip }
}

export const getProjectByIdInWorkspaceService = async (workspaceId, projectId) => {

    const project = await Project.findOne({ _id: projectId, workspace: workspaceId }).select("_id name description");

    if (!project) {
        throw new NotFoundException("Project Not Found");
    }

    return { project };
}

export const getProjectAnalyticsService = async (workspaceId, projectId) => {

    const project = await Project.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new NotFoundException("Project not found");
    }

    const currentDate = new Date();

    const taskAnalytics = await Task.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
                workspace: new mongoose.Types.ObjectId(workspaceId),
            },
        },
        {
            $facet: {
                totalTasks: [{ $count: "count" }],

                overdueTasks: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: { $ne: TaskStatusEnum.DONE },
                        },
                    },
                    { $count: "count" },
                ],

                completedTasks: [
                    {
                        $match: {
                            status: TaskStatusEnum.DONE,
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const _analytics = taskAnalytics[0];

    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overdueTasks: _analytics.overdueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTasks[0]?.count || 0,
    };

    return {
        analytics,
    };
}


export const updateProjectInWorkspaceService = async (
    workspaceId,
    projectId,
    body
) => {
    const { name, emoji, description } = body;

    const project = await Project.findOne({
        _id: projectId,
        workspace: workspaceId,
    });

    if (!project) {
        throw new NotFoundException(
            "Project not found"
        );
    }

    if (emoji) project.emoji = emoji;
    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();

    return { project };
};

export const deleteProjectService = async (
    workspaceId,
    projectId
) => {
    const project = await Project.findOne({
        _id: projectId,
        workspace: workspaceId,
    });

    if (!project) {
        throw new NotFoundException(
            "Project not found"
        );
    }

    await project.deleteOne();

    await Task.deleteMany({
        project: project._id,
    });

    return project;
};