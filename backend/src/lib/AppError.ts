export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public status: string = statusCode.toString().startsWith("4") ? "fail" : "error",
        public isOperational: boolean = true
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}