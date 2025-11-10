// modules
import { NextFunction, Request, Response } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (controller: AsyncController) => {
    return (req: Request, res: Response, next: NextFunction) => {
        controller(req, res, next).catch(error => next(error));
    }
}