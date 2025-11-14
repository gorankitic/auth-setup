// modules
import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().max(50).optional(),
    photoUrl: z.url().optional(),
}).strict();
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;