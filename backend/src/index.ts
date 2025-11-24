// modules
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import hpp from "hpp";
// config
import { connectDatabase } from "./config/database";
// constants
import { CLIENT_ORIGIN, NODE_ENV, PORT } from "./constants/env";
// middlewares
import { protect } from "./middleware/authMiddleware";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { globalRateLimiter } from "./middleware/rateLimiters";
import { sanitizeMongo } from "./middleware/sanitizeMongo";
// (routers)
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import sessionRouter from "./routes/session.routes";
// lib
import { AppError } from "./lib/utils/AppError";

// Initialize express application
const app = express();

// MIDDLEWARES
// 1) Trust proxy
app.set("trust proxy", true);
// 2) Cors
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
// 3) Security headers
app.use(helmet({ contentSecurityPolicy: false }));
// 4) Body parsing + size limit
app.use(express.json({ limit: "10kb" }));
// 5) Cookie parser
app.use(cookieParser());
// 6) Logging
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
// 7) Global rate limiter
app.use("/api", globalRateLimiter);
// 8) Sanitize request against NoSQL injection
app.use(sanitizeMongo);
// 9). Prevent HTTP parameter pollution
app.use(hpp());

// (Routers)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", protect, userRouter);
app.use("/api/v1/sessions", protect, sessionRouter);

// Catch-all for undefined routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

(async () => {
    try {
        // Connect MongoDb
        await connectDatabase();
        // Start listening for http requests
        app.listen(PORT, () => {
            console.log(chalk.bgGreen.bold(`Server is up in ${NODE_ENV} environment on port ${PORT}.`));
        });
    } catch (error) {
        console.log(chalk.red.bold(error));
    }
})();