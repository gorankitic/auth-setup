// modules
import type { Request, Response, NextFunction } from "express";

export const sanitizeMongo = (req: Request, res: Response, next: NextFunction) => {
    const sanitize = (obj: any) => {
        if (obj && typeof obj === "object") {
            for (const key in obj) {
                if (key.startsWith("$") || key.includes(".")) {
                    delete obj[key];
                }
            }
        }
    };

    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);

    next();
}
