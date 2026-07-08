import { inject, injectable } from "inversify";
import { IAuthController } from "./interfaces/auth.controller.interface.js";
import { TYPES } from "../di/types.js";
import { IAuthService } from "../services/interfaces/auth.service.interface.js";
import { Request, RequestHandler, Response } from "express";
import { tryCatch } from "../handlers/try-catch.js";
import { RegisterTenantDTO, SigninDTO } from "../dto/auth.dto.js";
import { accesCookieConfig, refreshCookieConfig } from "../config/cookie.js";
import { createResponse } from "../handlers/response-handler.js";
import { statusCodes } from "../constants/enums/statusCodes.js";
import { Tokens } from "../constants/enums/tokens.js";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
  ) {}

  register: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const registerDTO: RegisterTenantDTO = req.body;
      const { user, accessToken, refreshToken } =
        await this._authService.registerTenant(registerDTO);

      res.cookie(Tokens.ACCESS_TOKEN, accessToken, accesCookieConfig);
      res.cookie(Tokens.REFRESH_TOKEN, refreshToken, refreshCookieConfig);

      return createResponse(
        res,
        statusCodes.CREATED,
        true,
        "Tenant Registered Successfully",
        user,
      );
    },
  );

  signin: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const signinDTO: SigninDTO = req.body;

      const { user, accessToken, refreshToken } =
        await this._authService.signin(signinDTO);

      res.cookie(Tokens.ACCESS_TOKEN, accessToken, accesCookieConfig);
      res.cookie(Tokens.REFRESH_TOKEN, refreshToken, refreshCookieConfig);

      return createResponse(
        res,
        statusCodes.CREATED,
        true,
        "User logged in successfully",
        user,
      );
    },
  );

  me: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this._authService.me(req.user!.userId);

      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "User profile retrieved successfully",
        user,
      );
    },
  );

  logout: RequestHandler = tryCatch(
    async (_req: Request, res: Response): Promise<void> => {
      res.clearCookie(Tokens.ACCESS_TOKEN, accesCookieConfig);
      res.clearCookie(Tokens.REFRESH_TOKEN, refreshCookieConfig);

      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "User logged out successfully",
      );
    },
  );
}
