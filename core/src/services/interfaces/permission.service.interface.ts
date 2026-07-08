import { PermissionsDTO } from "dto/permissions.dto";

export interface IPermissionService {
  getAllPermissions(tenantId: string): Promise<PermissionsDTO[]>;
}
