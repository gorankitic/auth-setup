const rateLimiter = require("express-rate-limit");
const AppError = require("../utils/appError");

exports.loginLimiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30 minutes
    limit: 5, // Limit each IP to 10 requests per `window` (here, per 30 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    message: "Too many login attempts from this IP address. Try again in 30 minutes.",
    handler: (req, res, next, options) => next(new AppError(options.message, options.statusCode))
});

exports.limiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 30 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    message: "Too many login attempts from this IP address. Try again in 30 minutes.",
    handler: (req, res, next, options) => next(new AppError(options.message, options.statusCode))
});