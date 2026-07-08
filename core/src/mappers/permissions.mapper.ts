import { PermissionsDTO } from "../dto/permissions.dto.js";
import { IPermission } from "../model/permission.model.js";

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
