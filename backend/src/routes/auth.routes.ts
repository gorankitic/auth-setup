// modules
import express from "express";
// controllers
import { forgotPassword, refresh, resetPassword, signIn, signOut, signOutAll, signUp, updatePassword, verification } from "src/controllers/auth.controllers";
// schemas
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema, updatePasswordSchema } from "src/lib/schemas/auth.schemas";
// middlewares
import { validate } from "src/middleware/validateSchema";
import { protect } from "src/middleware/authMiddleware";
import { authRateLimiter, refreshRateLimiter } from "src/middleware/rateLimiters";

const router = express.Router();

router
    .post("/signup", authRateLimiter, validate(signupSchema), signUp)
    .post("/signin", authRateLimiter, validate(signinSchema), signIn)
    .post("/refresh", refreshRateLimiter, refresh)
    .post("/signout", protect, signOut)
    .post("/signoutall", protect, signOutAll)
    .post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPassword)
    .patch("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPassword)
    .patch("/update-password", protect, authRateLimiter, validate(updatePasswordSchema), updatePassword)
    .get("/verification", verification)

export default router;