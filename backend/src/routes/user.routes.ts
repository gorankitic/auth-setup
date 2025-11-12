// modules
import express from "express";
// controllers
import { refresh, signIn, signOut, signOutAll, signUp } from "src/controllers/auth.controllers.ts";
// schemas
import { signinSchema, signupSchema } from "src/lib/schemas/auth.schemas.ts";
// middlewares
import { validate } from "src/middleware/validateSchema.ts";
import { protect } from "src/middleware/authMiddleware.ts";

const router = express.Router();

router
    .post("/signup", validate(signupSchema), signUp)
    .post("/signin", validate(signinSchema), signIn)
    .post("/refresh", refresh)
    .post("/signout", protect, signOut)
    .post("/signoutall", protect, signOutAll)

export default router;