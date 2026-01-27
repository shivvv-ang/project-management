import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enum/task.enum.js";

export const taskStatusEnum = z.enum(Object.values(TaskStatusEnum));
export const taskPriorityEnum = z.enum(Object.values(TaskPriorityEnum));


export const taskBaseSchema = {
    title: z
        .string()
        .min(1, "Task title is required")
        .trim(),

    description: z
        .string()
        .trim()
        .nullable()
        .optional(),

    status: taskStatusEnum.optional(),

    priority: taskPriorityEnum.optional(),

    assignedTo: z
        .string()
        .nullable()
        .optional(),

    dueDate: z
        .coerce.date()
        .nullable()
        .optional(),
};


export const createTaskSchema = z.object({
    ...taskBaseSchema,
});

export const updateTaskSchema = z.object({
    ...taskBaseSchema,
}).partial();