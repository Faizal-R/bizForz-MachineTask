import { inject, injectable } from "inversify";
import { Request, RequestHandler, Response } from "express";
import { TYPES } from "../di/types.js";
import { IPermissionController } from "./interfaces/permission.controller.interface.js";
import { IPermissionService } from "../services/interfaces/permission.service.interface.js";
import { tryCatch } from "../handlers/try-catch.js";
import { createResponse } from "../handlers/response-handler.js";
import { statusCodes } from "../constants/enums/statusCodes.js";

@injectable()
export class PermissionController implements IPermissionController {
  constructor(
    @inject(TYPES.PermissionService)
    private readonly _permissionService: IPermissionService,
  ) {}

  getAllPermissions: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const permissions = await this._permissionService.getAllPermissions(req.user!.tenantId);

      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Permissions retrieved successfully",
        permissions,
      );
    },
  );
}
