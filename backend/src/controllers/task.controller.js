
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getMemberRoleinWorkspace } from "../services/member.index.js";
import { roleGuard } from "../utils/roleGuard.js";
import { createTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, updateTaskService } from "../services/task.index.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validation.js";
import { HTTPSTATUS } from "../configs/http.config.js";
import { Permissions } from "../enum/role-permission.enum.js";

export const createTask = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const body = createTaskSchema.parse(req.body);
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);

        roleGuard(roleName, [Permissions.CREATE_TASK]);

        const { task } = await createTaskService(
            workspaceId,
            projectId,
            userId,
            body
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Task created successfully",
            task,
        });
    }
);

export const updateTask = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const body = updateTaskSchema.parse(req.body);

        const taskId = req.params.taskId;
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;


        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.EDIT_TASK]);

        const { updatedTask } = await updateTaskService(
            workspaceId,
            projectId,
            taskId,
            body
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    }
);

export const getAllTasks = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const workspaceId = req.params.workspaceId;

        const filters = {
            projectId: req.query.projectId,
            status: req.query.status
                ? (req.query.status)?.split(",")
                : undefined,
            priority: req.query.priority
                ? (req.query.priority)?.split(",")
                : undefined,
            assignedTo: req.query.assignedTo
                ? (req.query.assignedTo)?.split(",")
                : undefined,
            keyword: req.query.keyword,
            dueDate: req.query.dueDate,
        };

        const pagination = {
            pageSize: parseInt(req.query.pageSize) || 10,
            pageNumber: parseInt(req.query.pageNumber) || 1,
        };

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.VIEW_ONLY]);

        const result = await getAllTasksService(workspaceId, filters, pagination);

        return res.status(HTTPSTATUS.OK).json({
            message: "All tasks fetched successfully",
            ...result,
        });
    }
);

export const getTaskById = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const taskId = req.params.taskId;
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.VIEW_ONLY]);

        const task = await getTaskByIdService(workspaceId, projectId, taskId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Task fetched successfully",
            task,
        });
    }
);

export const deleteTask = asyncHandler(
    async (req, res) => {
        const userId = req.user?._id;

        const taskId = req.params.taskId;
        const workspaceId = req.params.workspaceId;

        const { roleName } = await getMemberRoleinWorkspace(userId, workspaceId);
        roleGuard(roleName, [Permissions.DELETE_TASK]);

        await deleteTaskService(workspaceId, taskId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Task deleted successfully",
        });
    }
);