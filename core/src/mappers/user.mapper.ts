import { IUser } from "../model/user.model.js";
import { UserResponseDTO } from "../dto/user.dto.js";

export class UserMapper {
  static toResponse(user: IUser): UserResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roles: user.roles?.map((role: any) => role.name ? role.name : role),
      customPermissions: user.customPermissions?.map((permission: any) =>
        permission.name ? permission.name : permission.toString()
      ),
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
