// modules
import express from "express";
// controllers
import { getSessions } from "src/controllers/session.controllers";

const router = express.Router();

router
    .get("/", getSessions)

export default router;