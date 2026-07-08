import { IRole } from "../../model/role.model.js";
import { RoleResponseDTO, CreateRoleDTO, UpdateRoleDTO } from "../../dto/role.dto.js";

export interface IRoleService {
  getAllRoles(tenantId: string): Promise<RoleResponseDTO[]>;
  createRole(tenantId: string, roleData: CreateRoleDTO): Promise<RoleResponseDTO>;
  updateRole(roleId: string, tenantId: string, roleData: UpdateRoleDTO): Promise<RoleResponseDTO | null>;
  deleteRole(roleId: string, tenantId: string): Promise<boolean>;
}
