import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IRole, Role } from "../../model/role.model";
import { IRoleRepository } from "../interfaces/role.repository.interface";
import { Types } from "mongoose";

@injectable()
export class RoleRepository
  extends BaseRepository<IRole>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }

  async findByNameAndTenant(
    name: string,
    tenantId: string,
  ): Promise<IRole | null> {
    return this.model
      .findOne({ name, tenantId: new Types.ObjectId(tenantId) })
      .populate("permissions")
      .exec();
  }

  async findRolesByIds(ids: Types.ObjectId[]): Promise<IRole[]> {
    return this.model
      .find({ _id: { $in: ids } })
      .populate("permissions")
      .exec();
  }

  async findTenantRoles(tenantId: string): Promise<IRole[]> {
    return this.model
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate("permissions")
      .exec();
  }
}
