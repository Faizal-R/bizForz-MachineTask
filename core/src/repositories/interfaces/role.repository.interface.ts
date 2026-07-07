import { IRole } from "../../model/role.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IRoleRepository extends IBaseRepository<IRole> {
  findByNameAndTenant(name: string, tenantId: string): Promise<IRole | null>;
}
