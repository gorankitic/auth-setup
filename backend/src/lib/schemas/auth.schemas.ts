// modules
import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" }),
    email: z
        .email({ message: "Email is invalid" })
        .max(255, { message: "Email cannot exceed 255 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(128, { message: "Password cannot exceed 128 characters" }),
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.email({ message: "Email is invalid" }),
    password: z.string().min(1, { message: "Password is required" })
});

export type SigninSchema = z.infer<typeof signinSchema>;