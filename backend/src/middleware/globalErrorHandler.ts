// modules
import { NextFunction, Response, Request } from "express";
import chalk from "chalk";
// constants
import { NODE_ENV } from "src/constants/env.ts";

export interface ExtendedError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    code?: number;
    errors?: any;
    path?: string;
    value?: any;
}

// Send more error details in development mode
const sendErrorDev = (err: ExtendedError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

// Send error to client when in production mode
const sendErrorProd = (err: ExtendedError, res: Response) => {
    // Operational, trusted error (exception)
    // Send nice, human readable message to client side
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error, don't leak too much details
        // 1. Log error
        console.log(chalk.red(err));
        // 2. Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went wrong."
        });
    }
}

export const globalErrorHandler = (err: ExtendedError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (NODE_ENV === "production") {
        let error = Object.assign(err);

        sendErrorProd(error, res);
    }
}