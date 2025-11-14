// modules
import express from "express";
// controllers
import { forgotPassword, refresh, resetPassword, signIn, signOut, signOutAll, signUp, updatePassword, verification } from "src/controllers/auth.controllers.ts";
// schemas
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema, updatePasswordSchema } from "src/lib/schemas/auth.schemas.ts";
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
    .post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
    .patch("/reset-password", validate(resetPasswordSchema), resetPassword)
    .patch("/update-password", protect, validate(updatePasswordSchema), updatePassword)
    .get("/verification", verification)

export default router;