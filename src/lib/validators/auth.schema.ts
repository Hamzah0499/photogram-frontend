import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .trim(),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,24}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .min(8, "Password must be at least 8 characters")
        .max(24, "Password must be at most 24 characters")
        .trim()
});

export type LoginInput = z.infer<typeof loginSchema>;
