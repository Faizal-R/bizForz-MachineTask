import { inject, injectable } from "inversify";
import { IRoleController } from "./interfaces/role.controller.interface";
import { TYPES } from "di/types";
import { IRoleService } from "services/interfaces/role.service.interface";
import { Request, Response, RequestHandler } from "express";
import { tryCatch } from "handlers/try-catch";
import { createResponse } from "handlers/response-handler";
import { statusCodes } from "constants/enums/statusCodes";

@injectable()
export class RoleController implements IRoleController {
  constructor(
    @inject(TYPES.RoleService) private readonly _roleService: IRoleService,
  ) {}

  getAll: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const roles = await this._roleService.getAllRoles(tenantId);
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Roles retrieved successfully",
        roles,
      );
    },
  );

  create: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const role = await this._roleService.createRole(tenantId, req.body);
      return createResponse(
        res,
        statusCodes.CREATED,
        true,
        "Role created successfully",
        role,
      );
    },
  );

  update: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { roleId } = req.params;
      const role = await this._roleService.updateRole(roleId as string, tenantId, req.body);
      if (!role) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "Role not found",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Role updated successfully",
        role,
      );
    },
  );

  delete: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { roleId } = req.params;
      const success = await this._roleService.deleteRole(roleId as string, tenantId);
      if (!success) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "Role not found or deletion failed",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Role deleted successfully",
        null,
      );
    },
  );
}
