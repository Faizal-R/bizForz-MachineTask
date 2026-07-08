import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EnvConfig } from "../config/env";
import { Tokens } from "../constants/enums/tokens";
import { CustomError } from "../utils/custom-error";
import { statusCodes } from "../constants/enums/statusCodes";
import { TokenPayload } from "../helpers/generateTokens";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.[Tokens.ACCESS_TOKEN] ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new CustomError("Not authorized to access this route", statusCodes.UNAUTHORIZED),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      EnvConfig.ACCESS_TOKEN_SECRET,
    ) as TokenPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new CustomError("Not authorized to access this route", statusCodes.UNAUTHORIZED),
    );
  }
};
