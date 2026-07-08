import { PermissionsDTO } from "dto/permissions.dto";
import { IPermission } from "model/permission.model";

export const PermissionsMapper = {
  toResponse(permission: IPermission): PermissionsDTO {
    return {
      id: permission._id.toString(),
      name: permission.name,
      category: permission.category,
      description: permission.description,
      tenantId: permission.tenantId ? permission.tenantId.toString() : null,
    };
  },
  toResponseAll(permissions: IPermission[]): PermissionsDTO[] {
    return permissions.map(this.toResponse);
  },
};
