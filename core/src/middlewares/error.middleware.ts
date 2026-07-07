import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../handlers/response-handler"

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  errorResponse(res, err);
};