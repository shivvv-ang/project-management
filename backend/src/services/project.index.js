import Project from "../models/project.model.js"

export const createProjectService = async (userId, workspaceId, body) => {
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

export const getProjectsInWorkspaceService = async (workspaceId, pageSize, pageNumber) => {
    const totoalDocs = await Project.countDocuments({ workspace: workspaceId });

    const skip = (pageNumber - 1) * pageSize;

    const projects = await Project.find({
        workspace: workspaceId
    }).skip(skip).limit(pageSize).populate("createdBy", "_id name profilePicture -password").sort({ createdAt: -1 });

    const totalPages = Math.ceil(totoalDocs / pageSize);

    return { projects, totoalDocs, totalPages, skip }
}