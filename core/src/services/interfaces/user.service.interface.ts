import { IUser } from "../../model/user.model";
import { UserResponseDTO, CreateUserDTO } from "../../dto/user.dto";

export interface IUserService {
  getAllUsers(tenantId: string): Promise<UserResponseDTO[]>;
  createUser(tenantId: string, userData: CreateUserDTO): Promise<UserResponseDTO>;
  updateUserRole(userId: string, tenantId: string, roleNames: string[]): Promise<UserResponseDTO | null>;
  updateUserPermissions(userId: string, tenantId: string, permissionNames: string[]): Promise<UserResponseDTO | null>;
}
