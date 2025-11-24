// modules
import pino from "pino";
// constants
import { NODE_ENV } from "@/constants/env";

const isProd = NODE_ENV === "production";

export const logger = pino({
    level: "info",
    // Always include timestamp
    timestamp: pino.stdTimeFunctions.isoTime,
    // Pretty logs in development, JSON logs in production
    transport: isProd
        ? undefined
        : {
            targets: [
                {
                    target: "pino-pretty",
                    level: "info",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        ignore: "pid,hostname",
                        levelFirst: true,
                        messageFormat: "{level}: {msg}",
                        customColors: "INFO:blue,WARN:yellow,ERROR:red"
                    }
                }
            ]
        },
});
