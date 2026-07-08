import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types.js";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface.js";
import { IPermissionService } from "../interfaces/permission.service.interface.js";
import { CustomError } from "../../utils/custom-error.js";
import { statusCodes } from "../../constants/enums/statusCodes.js";
import { PermissionsMapper } from "../../mappers/permissions.mapper.js";
import { PermissionsDTO } from "../../dto/permissions.dto.js";
import { Types } from "mongoose";

@injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @inject(TYPES.PermissionRepository)
    private _permissionRepository: IPermissionRepository,
  ) {}

  async getAllPermissions(tenantId: string): Promise<PermissionsDTO[]> {
    try {
      const permissions = await this._permissionRepository.find({
        $or: [
          { tenantId: null },
          { tenantId: new Types.ObjectId(tenantId) },
        ],
      } as any);
      if (!permissions) {
        throw new CustomError("No permissions found", statusCodes.NOT_FOUND);
      }
      return PermissionsMapper.toResponseAll(permissions);
    } catch (error) {
      throw error;
    }
  }
}