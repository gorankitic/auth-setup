// modules
import express from "express";
// controllers
import { getUser, updateUser } from "src/controllers/user.controllers.ts";
// schemas
import { updateUserSchema } from "src/lib/schemas/user.schemas.ts";
// middlewares
import { validate } from "src/middleware/validateSchema.ts";

const router = express.Router();

router
    .get("/", getUser)
    .patch("/update", validate(updateUserSchema), updateUser)

export default router;