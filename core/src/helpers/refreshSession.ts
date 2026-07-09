import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { EnvConfig } from "../config/env.js";
import { accesCookieConfig, refreshCookieConfig } from "../config/cookie.js";

import { Tokens } from "../constants/enums/tokens.js";
import { statusCodes } from "../constants/enums/statusCodes.js";
import { AuthMessage } from "../constants/messages/auth.messages.js";

import { CustomError } from "../utils/custom-error.js";

import { generateTokens, TokenPayload } from "./generateTokens.js";

import { resolve } from "../di/index.js";
import { TYPES } from "../di/types.js";

import { IUserRepository } from "../repositories/interfaces/user.repository.interface.js";

import { IRole } from "../model/role.model.js";

export const refreshSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[Tokens.REFRESH_TOKEN];

    if (!refreshToken) {
      return next(
        new CustomError(
          AuthMessage.AUTH_REQUIRED_MESSAGE,
          statusCodes.UNAUTHORIZED,
        ),
      );
    }

    const refreshTokenPayload = jwt.verify(
      refreshToken,
      EnvConfig.REFRESH_TOKEN_SECRET,
    ) as Pick<TokenPayload, "userId">;

    const userRepository = resolve<IUserRepository>(TYPES.UserRepository);

    const user = await userRepository.findByIdWithRelations(
      refreshTokenPayload.userId,
    );

    if (!user || user.status !== "active") {
      return next(
        new CustomError(
          AuthMessage.ACCOUNT_UNAVAILABLE_MESSAGE,
          statusCodes.UNAUTHORIZED,
        ),
      );
    }

    const accessTokenPayload: TokenPayload = {
      userId: user._id.toString(),

      tenantId: user.tenantId.toString(),

      roles: (user.roles as IRole[]).map((role) => role.name),
    };

    const newAccessToken = generateTokens.accessToken(accessTokenPayload);

    const newRefreshToken = generateTokens.refreshToken({
      userId: user._id.toString(),
    });

    res.cookie(Tokens.ACCESS_TOKEN, newAccessToken, accesCookieConfig);

    res.cookie(Tokens.REFRESH_TOKEN, newRefreshToken, refreshCookieConfig);

    req.user = accessTokenPayload;
    console.log("Token Refreshed");
    return next();
  } catch {
    return next(
      new CustomError(
        AuthMessage.SESSION_EXPIRED_MESSAGE,
        statusCodes.UNAUTHORIZED,
      ),
    );
  }
};
