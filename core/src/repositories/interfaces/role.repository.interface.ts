import { Types } from "mongoose";
import { IRole } from "../../model/role.model.js";
import { IBaseRepository } from "./base.repository.interface.js";

export interface IRoleRepository extends IBaseRepository<IRole> {
  findByNameAndTenant(name: string, tenantId: string): Promise<IRole | null>;
  findRolesByIds(ids: Types.ObjectId[]): Promise<IRole[]>;
  findTenantRoles(tenantId: string): Promise<IRole[]>;
}
