import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../handlers/response-handler.js"

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  errorResponse(res, err);
};
