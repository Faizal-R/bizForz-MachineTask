import { IUser } from "../../model/user.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmailAndTenant(email: string, tenantId: string): Promise<IUser | null>;
  findUserWithPermissions(userId: string): Promise<IUser | null>;
  findTenantUsers(tenantId: string): Promise<IUser[]>;
  findByIdWithRelations(userId: string): Promise<IUser | null>;
}
