// modules
import express from "express";
// controllers
import { getUploadcareSignature, getUser, updateAvatar, updateData } from "src/controllers/user.controllers.ts";
// schemas
import { updateAvatarSchema, updateDataSchema } from "src/lib/schemas/user.schemas.ts";
// middlewares
import { validate } from "src/middleware/validateSchema.ts";
import { uploadRateLimiter } from "src/middleware/rateLimiters.ts";

const router = express.Router();

router
    .get("/", getUser)
    .get("/signature", uploadRateLimiter, getUploadcareSignature)
    .patch("/update-data", validate(updateDataSchema), updateData)
    .patch("/update-avatar", validate(updateAvatarSchema), updateAvatar)

export default router;