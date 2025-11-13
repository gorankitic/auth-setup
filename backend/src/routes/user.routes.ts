// modules
import express from "express";
// middlewares
import { protect } from "src/middleware/authMiddleware.ts";

const router = express.Router();

router.
    post("/uploads/profile-photo", protect,)



export default router;