import { Request, Response, NextFunction, RequestHandler } from "express";

export const tryCatch =
  (controllerFn: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (error) {
      next(error);
    }
  };