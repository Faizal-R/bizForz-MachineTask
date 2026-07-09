import jwt from "jsonwebtoken";
import { EnvConfig } from "../config/env.js";

export interface TokenPayload {
  userId: string;
  tenantId: string;
  roles: string[];
}

export const generateTokens = {
  accessToken(payload: TokenPayload): string {
    return jwt.sign(payload, EnvConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  },

  refreshToken(payload: { userId: string}): string {
    return jwt.sign(payload, EnvConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  },
};
