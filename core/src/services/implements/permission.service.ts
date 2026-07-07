import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface";
import { IPermissionService } from "../interfaces/permission.service.interface";

@injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @inject(TYPES.PermissionRepository) private _permissionRepository: IPermissionRepository
  ) {}
}
