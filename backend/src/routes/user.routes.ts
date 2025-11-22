// modules
import express from "express";
// controllers
import { getUploadcareSignature, getUser, updateAvatar, updateData } from "src/controllers/user.controllers";
// schemas
import { updateAvatarSchema, updateDataSchema } from "src/lib/schemas/user.schemas";
// middlewares
import { validate } from "src/middleware/validateSchema";
import { uploadRateLimiter } from "src/middleware/rateLimiters";

const router = express.Router();

router
    .get("/", getUser)
    .get("/signature", uploadRateLimiter, getUploadcareSignature)
    .patch("/update-data", validate(updateDataSchema), updateData)
    .patch("/update-avatar", validate(updateAvatarSchema), updateAvatar)

export default router;