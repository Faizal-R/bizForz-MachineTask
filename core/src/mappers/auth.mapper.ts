import { AuthResponseDTO } from "dto/auth.dto";
import { IUser } from "model/user.model";
import { IRole } from "model/role.model";

export const AuthMapper = {
  toResponse: (
    user: IUser,
    roles: IRole[],
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDTO => {
    return {
      user: {
        id: user._id.toString(),
        tenantId: user.tenantId.toString(),
        name: user.name,
        roles: roles.map((r) => r.name),
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  },
};
