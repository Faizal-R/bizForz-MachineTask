import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IPermission, Permission } from "../../model/permission.model";
import { IPermissionRepository } from "../interfaces/permission.repository.interface";

@injectable()
export class PermissionRepository extends BaseRepository<IPermission> implements IPermissionRepository {
  constructor() {
    super(Permission);
  }
}
