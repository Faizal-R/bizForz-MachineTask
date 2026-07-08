import { AuthResponseDTO } from "dto/auth.dto";
import { IUser } from "model/user.model";
import { IRole } from "model/role.model";
import { IPermission } from "model/permission.model";

export const AuthMapper = {
  toAuthUser: (user: IUser, roles: IRole[]): AuthResponseDTO["user"] => {
    const permissionNames = Array.from(
      new Set(
        roles.flatMap((r) => (r.permissions as unknown as IPermission[]).map((p) => p.name))
      )
    ) as string[];

    return {
      id: user._id.toString(),
      tenantId: user.tenantId.toString(),
      name: user.name,
      roles: roles.map((r) => r.name),
      permissions: permissionNames,
      status: user.status,
    };
  },

  toResponse: (
    user: IUser,
    roles: IRole[],
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDTO => {
    return {
      user: AuthMapper.toAuthUser(user, roles),
      accessToken,
      refreshToken,
    };
  },
};
