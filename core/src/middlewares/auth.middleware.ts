import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EnvConfig } from "../config/env.js";
import { Tokens } from "../constants/enums/tokens.js";
import { CustomError } from "../utils/custom-error.js";
import { statusCodes } from "../constants/enums/statusCodes.js";
import { TokenPayload } from "../helpers/generateTokens.js";
import { User } from "../model/user.model.js";
import { PermissionName } from "../constants/permissions.js";
import { IRole } from "../model/role.model.js";
import { IPermission } from "../model/permission.model.js";
import { refreshSession } from "helpers/refreshSession.js";
import { AuthMessage } from "constants/messages/auth.messages.js";
import { resolve } from "di/index.js";
import { TYPES } from "di/types.js";



declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      permissions?: string[];
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[Tokens.ACCESS_TOKEN];
  console.log("Token",token)

  if (!token) {
   return refreshSession(req, res, next);
  }

  try {
    const decoded = jwt.verify(
      token,
      EnvConfig.ACCESS_TOKEN_SECRET,
    ) as TokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    
    return refreshSession(req, res, next);
  }
};

export const authorize = (...requiredPermissions: PermissionName[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new CustomError(AuthMessage.AUTH_REQUIRED_MESSAGE, statusCodes.UNAUTHORIZED),
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
          new CustomError(
            AuthMessage.ACCOUNT_UNAVAILABLE_MESSAGE,
            statusCodes.UNAUTHORIZED,
          ),
        );
      }

      const rolePermissions = (user.roles as IRole[]).flatMap((role) =>
        ((role.permissions as IPermission[]) || []).map(
          (permission: IPermission) => permission.name,
        ),
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
          new CustomError(AuthMessage.PERMISSION_DENIED_MESSAGE, statusCodes.FORBIDDEN),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
