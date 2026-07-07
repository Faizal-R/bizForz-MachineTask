import { inject, injectable } from "inversify";
import { IAuthController } from "./interfaces/auth.controller.interface";
import { Types } from "mongoose";
import { TYPES } from "di/types";
import { IAuthService } from "services/interfaces/auth.service.interface";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { tryCatch } from "handlers/try-catch";
import { RegisterTenantDTO } from "dto/auth.dto";
import { accesCookieConfig } from "config/cookie";
import { createResponse } from "handlers/response-handler";
import { statusCodes } from "constants/enums/statusCodes";

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

      res.cookie("accessToken", accessToken, accesCookieConfig);
      res.cookie("refreshToken", refreshToken, accesCookieConfig);

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
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {},
  );
}
