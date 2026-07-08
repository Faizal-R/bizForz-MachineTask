import { IRole } from "../model/role.model.js";
import { RoleResponseDTO } from "../dto/role.dto.js";

export class RoleMapper {
  static toResponse(role: IRole): RoleResponseDTO {
    return {
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map((perm: any) => perm.name ? perm.name : perm), 
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
