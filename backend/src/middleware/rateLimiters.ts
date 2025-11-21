// modules
import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Global: 200 requests per 15 minutes per IP
const globalLimiter = new RateLimiterMemory({
    points: 200,   // Maximum number of requests
    duration: 15 * 60, // Per 15 minutes
});

export const globalRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await globalLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));

        return res.status(429).json({
            status: "error",
            message: "Too many requests. Slow down.",
        });
    }
};

// Auth: 5 requests every 15 minutes per IP
const authLimiter = new RateLimiterMemory({
    points: 5,
    duration: 15 * 60,
});

export const authRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));

        return res.status(429).json({
            status: "error",
            message: "Too many attempts. Try again later.",
        });
    }
};

// Refresh token: 20 requests every 15 minutes per IP
const refreshLimiter = new RateLimiterMemory({
    points: 20,
    duration: 15 * 60,
});

export const refreshRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await refreshLimiter.consume(req.ip!);
        next();
    } catch (err: any) {
        res.set("Retry-After", String(Math.ceil(err.msBeforeNext / 1000)));

        return res.status(429).json({
            status: "error",
            message: "Too many refresh attempts. Please sign in again.",
        });
    }
};

const uploadLimiter = new RateLimiterMemory({
    points: 10,            // 10 uploads
    duration: 10 * 60,     // per 10 minutes
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