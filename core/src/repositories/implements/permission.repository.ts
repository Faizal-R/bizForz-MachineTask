import { injectable } from "inversify";
import { BaseRepository } from "./base.repository.js";
import { IPermission, Permission } from "../../model/permission.model.js";
import { IPermissionRepository } from "../interfaces/permission.repository.interface.js";

@injectable()
export class PermissionRepository extends BaseRepository<IPermission> implements IPermissionRepository {
  constructor() {
    super(Permission);
  }
}
