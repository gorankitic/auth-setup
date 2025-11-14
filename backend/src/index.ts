// modules
import express from "express";
import morgan from "morgan";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createRouteHandler } from "uploadthing/express";
// config
import { connectDatabase } from "./config/database.ts";
// constants
import { CLIENT_ORIGIN, NODE_ENV, PORT } from "./constants/env.ts";
// middlewares
import { globalErrorHandler } from "./middleware/globalErrorHandler.ts";
// (routers)
import authRouter from "./routes/auth.routes.ts";
import userRouter from "./routes/user.routes.ts";
// lib
import { AppError } from "./lib/utils/AppError.ts";
import { uploadRouter } from "./lib/upload/uploadthing.ts";

// Initialize express application
const app = express();

// MIDDLEWARES
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use("/api/v1/uploadthing", createRouteHandler({ router: uploadRouter }));
// (Routers)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

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