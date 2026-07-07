import { NextFunction, Request, RequestHandler, Response } from "express";
import { tryCatch } from "../handlers/try-catch";
import { ZodSchema } from "zod";
import { createResponse } from "../handlers/response-handler";
import { statusCodes } from "../constants/enums/statusCodes";

export const validate = (
  schema: ZodSchema,
): RequestHandler =>
  tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const { data, success, error } = schema.safeParse(req.body);
    if (!success) {
      console.log(error)
      return createResponse(
        res,
        statusCodes.BAD_REQUEST,
        false,
        error.issues[0].message,
      );
    }
    req.body = data;
    next();
  });