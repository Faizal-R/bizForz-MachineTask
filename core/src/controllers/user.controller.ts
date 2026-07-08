import { inject, injectable } from "inversify";
import { IUserController } from "./interfaces/user.controller.interface.js";
import { TYPES } from "../di/types.js";
import { IUserService } from "../services/interfaces/user.service.interface.js";
import { Request, Response, RequestHandler } from "express";
import { tryCatch } from "../handlers/try-catch.js";
import { createResponse } from "../handlers/response-handler.js";
import { statusCodes } from "../constants/enums/statusCodes.js";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: IUserService,
  ) {}

  getAll: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const users = await this._userService.getAllUsers(tenantId);
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Users retrieved successfully",
        users,
      );
    },
  );

  create: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const user = await this._userService.createUser(tenantId, req.body);
      return createResponse(
        res,
        statusCodes.CREATED,
        true,
        "User invited successfully",
        user,
      );
    },
  );

  updateRole: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { userId } = req.params;
      const { roles } = req.body;
      const requesterId = req.user!.userId;
      const user = await this._userService.updateUserRole(userId as string, tenantId, roles, requesterId);
      if (!user) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "User not found",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "User role updated successfully",
        user,
      );
    },
  );

  updatePermissions: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { userId } = req.params;
      const { permissions } = req.body;
      const requesterId = req.user!.userId;
      const user = await this._userService.updateUserPermissions(userId as string, tenantId, permissions, requesterId);
      if (!user) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "User not found",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "User permissions updated successfully",
        user,
      );
    },
  );
}
