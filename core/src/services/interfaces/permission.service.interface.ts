import { PermissionsDTO } from "../../dto/permissions.dto.js";

export interface IPermissionService {
  getAllPermissions(tenantId: string): Promise<PermissionsDTO[]>;
}
