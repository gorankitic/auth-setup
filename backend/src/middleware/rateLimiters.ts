// modules
import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// GLOBAL RATE LIMITER
// Protects entire API from abuse
// 200 requests per 1 minute per IP
const globalLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60,
});
export const globalRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await globalLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));
        return res.status(429).json({
            status: "error",
            message: "Too many requests. Please slow down."
        });
    }
}

// AUTH ROUTES LIMITER
// Strict protection for sensitive endpoints
// Refresh is EXCLUDED
const authLimiter = new RateLimiterMemory({
    points: 5,                 // 5 attempts
    duration: 15 * 60,         // every 15 minutes
});
export const authRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // skip /api/v1/auth/refresh
        if (req.path.includes("/api/v1/auth/refresh")) {
            return next();
        }

        await authLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));

        return res.status(429).json({
            status: "error",
            message: "Too many attempts. Try again later."
        });
    }
}


// PASSWORD LIMITER
// Forgot password, reset password
const sensitiveActionLimiter = new RateLimiterMemory({
    points: 5,          // 5 attempts
    duration: 60 * 60,  // per hour
});
export const sensitiveRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await sensitiveActionLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));
        return res.status(429).json({
            status: "error",
            message: "Too many attempts. Please slow down."
        });
    }
}

// UPLOAD RATE LIMITER
const uploadLimiter = new RateLimiterMemory({
    points: 5,           // 5 uploads
    duration: 10 * 60,   // per 10 minutes
});

export const uploadRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await uploadLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));
        return res.status(429).json({
            status: "error",
            message: "You are uploading too fast. Please slow down.",
        });
    }
};
