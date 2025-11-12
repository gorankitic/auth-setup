// modules
import { NextFunction, Response, Request } from "express";
import z from "zod";
import chalk from "chalk";
// constants
import { NODE_ENV } from "src/constants/env.ts";
// utils
import { AppError } from "src/lib/utils/AppError.ts";

// 🔥 HANDLING MONGOOSE ERRORS
// Handling invalid database IDs
const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

// Handling duplicate database field
const handleDuplicateFieldDB = (err: any) => {
    const value = Object.values(err.keyValue)[0];
    const message = `${value} already exists.`;
    return new AppError(message, 400);
}

// Handling mongoose validation errors
const handleValidationErrorDB = (error: any) => {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    const message = `${errors.join(" ")}`;
    return new AppError(message, 400);
}

// Handling invalid JWT error
const handleJWTError = () => new AppError("Please sign in again.", 401);

// Handling expired JWT error
const handleJWTExpiredError = () => new AppError("Your session has expired, please sign in again.", 401);

// 🔥 Handling Zod validation errors
const handleZodError = (error: z.ZodError, res: Response) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }));
    const message = errors.map(e => `${e.message}`).join(". ");
    return res.status(400).json({
        status: "fail",
        message,
        errors,
    });
};

// Send more error details in development environment
const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

// Send error to client when in production environment
const sendErrorProd = (err: AppError, res: Response) => {
    // Operational, trusted error (exception)
    // Send nice, human readable message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error, don't leak too much details
        // 1. Log error
        console.error(chalk.red(err));
        // 2. Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went wrong."
        });
    }
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // 1) Handle Zod errors
    if (err instanceof z.ZodError) {
        return handleZodError(err, res);
    }

    // 2) Handle Mongoose/JWT errors
    let error = err;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    // 3) Send response based on environmen
    const appError = error as AppError;
    appError.statusCode = appError.statusCode || 500;
    appError.status = appError.status || "error";

    if (NODE_ENV === "development") {
        sendErrorDev(appError, res);
    } else if (NODE_ENV === "production") {
        sendErrorProd(appError, res);
    }
}