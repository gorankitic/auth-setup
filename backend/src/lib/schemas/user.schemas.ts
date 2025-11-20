// modules
import { z } from "zod";

export const updateDataSchema = z.object({
    name: z.string().trim().max(50, "Name must be less than 50 characters").optional(),
}).strict();
export type UpdateDataSchema = z.infer<typeof updateDataSchema>;

export const updateAvatarSchema = z.object({
    avatarUuid: z.uuid()
});
export type UpdateAvatarSchema = z.infer<typeof updateAvatarSchema>;
