import { z } from "zod";

const baseSchema = {
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name cannot be empty")
        .trim(),

    description: z
        .string({
            invalid_type_error: "Description must be a string",
        })
        .trim()
        .optional(),
};


export const createSchema = z.object({
    ...baseSchema,
});


export const updateSchema = z
    .object({
        name: baseSchema.name.optional(),
        description: baseSchema.description,
    })
    .refine(
        (data) => data.name !== undefined || data.description !== undefined,
        {
            message: "At least one field must be provided to update",
            path: ["body"],
        }
    );
