// modules
import express from "express";
import morgan from "morgan";
import chalk from "chalk";
import cookieParser from "cookie-parser";
// config
import { connectDatabase } from "./config/database.ts";
// constants
import { NODE_ENV, PORT } from "./constants/env.ts";
// middlewares
import { globalErrorHandler } from "./middleware/globalErrorHandler.ts";
// (routers)
import userRouter from "./routes/user.routes.ts";
// lib
import { AppError } from "./lib/utils/AppError.ts";

// Initialize express application
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
// (Routers)
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