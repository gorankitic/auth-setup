// modules
import pinoHttp from "pino-http";
// config
import { logger } from "../config/logger";

export const requestLogger = pinoHttp({
    logger,
    customLogLevel(res, err) {
        const code = res.statusCode ?? 500;

        if (err) return "error";
        if (code >= 500) return "error";
        if (code >= 400) return "warn";
        return "info";
    },
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
                ip:
                    req.headers["x-forwarded-for"] ||
                    req.socket?.remoteAddress ||
                    req.ip ||
                    "unknown"
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },
    customSuccessMessage() {
        return "request completed";
    },
    customErrorMessage(_req, _res, err) {
        return `request errored: ${err.message}`;
    },
});
