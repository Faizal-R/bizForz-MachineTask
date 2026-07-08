import { inject, injectable } from "inversify";
import { Request, RequestHandler, Response } from "express";
import { TYPES } from "di/types";
import { IPermissionController } from "./interfaces/permission.controller.interface";
import { IPermissionService } from "services/interfaces/permission.service.interface";
import { tryCatch } from "handlers/try-catch";
import { createResponse } from "handlers/response-handler";
import { statusCodes } from "constants/enums/statusCodes";

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
