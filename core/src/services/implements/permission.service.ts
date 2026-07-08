import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface";
import { IPermissionService } from "../interfaces/permission.service.interface";
import { CustomError } from "utils/custom-error";
import { statusCodes } from "constants/enums/statusCodes";
import { PermissionsMapper } from "mappers/permissions.mapper";
import { PermissionsDTO } from "dto/permissions.dto";
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
