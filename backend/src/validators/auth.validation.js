import { z } from "zod";

export const userSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name cannot be empty")
        .trim(),

    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .trim()
        .toLowerCase()
        .email("Invalid email format"),      
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
});
