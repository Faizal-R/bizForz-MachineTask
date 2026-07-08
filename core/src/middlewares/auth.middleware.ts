import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EnvConfig } from "../config/env";
import { Tokens } from "../constants/enums/tokens";
import { CustomError } from "../utils/custom-error";
import { statusCodes } from "../constants/enums/statusCodes";
import { TokenPayload } from "../helpers/generateTokens";
import { User } from "../model/user.model";
import { PermissionName } from "../constants/permissions";
import { IRole } from "model/role.model";
import { IPermission } from "model/permission.model";

const AUTH_REQUIRED_MESSAGE = "Please sign in to continue.";
const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";
const ACCOUNT_UNAVAILABLE_MESSAGE = "Your account is no longer active or available. Please contact your administrator.";
const PERMISSION_DENIED_MESSAGE = "You do not have access to perform this action. Please contact your administrator if you need access.";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      permissions?: string[];
    }
  }
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.[Tokens.ACCESS_TOKEN]

  if (!token) {
    return next(
      new CustomError(AUTH_REQUIRED_MESSAGE, statusCodes.UNAUTHORIZED),
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
      new CustomError(SESSION_EXPIRED_MESSAGE, statusCodes.UNAUTHORIZED),
    );
  }
};

export const authorize = (...requiredPermissions: PermissionName[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new CustomError(AUTH_REQUIRED_MESSAGE, statusCodes.UNAUTHORIZED),
        );
      }

      const user = await User.findOne({
        _id: req.user.userId,
        tenantId: req.user.tenantId,
        status: "active",
      })
        .populate({
          path: "roles",
          populate: { path: "permissions" },
        })
        .populate("customPermissions")
        .exec();

      if (!user) {
        return next(
          new CustomError(ACCOUNT_UNAVAILABLE_MESSAGE, statusCodes.UNAUTHORIZED),
        );
      }

      const rolePermissions = (user.roles as IRole[]).flatMap((role) =>
        (role.permissions as IPermission[] || []).map((permission: IPermission) => permission.name),
      );
      const customPermissions = (user.customPermissions as IPermission[]).map(
        (permission) => permission.name,
      );
      const userPermissions = Array.from(
        new Set([...rolePermissions, ...customPermissions]),
      );

      req.permissions = userPermissions;

      const hasRequiredPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasRequiredPermission) {
        return next(
          new CustomError(
            PERMISSION_DENIED_MESSAGE,
            statusCodes.FORBIDDEN,
          ),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
