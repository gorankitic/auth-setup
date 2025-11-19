// modules
import express from "express";
// controllers
import { getSessions } from "src/controllers/session.controllers.ts";

const router = express.Router();

router
    .get("/", getSessions)

export default router;