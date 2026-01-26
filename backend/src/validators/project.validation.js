import { z } from "zod";

const projectBaseSchema = {
    name: z
        .string()
        .min(1, "Project name is required")
        .trim(),

    emoji: z
        .string()
        .min(1, "Emoji is required")
        .optional(),

    description: z
        .string()
        .optional(),
};


export const createProjectSchema = z.object({
    name: projectBaseSchema.name,
    emoji: projectBaseSchema.emoji,
    description: projectBaseSchema.description,
});

export const updateProjectSchema = z.object(projectBaseSchema).partial();