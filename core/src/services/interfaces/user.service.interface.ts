import { IUser } from "../../model/user.model.js";
import { UserResponseDTO, CreateUserDTO } from "../../dto/user.dto.js";

export interface IUserService {
  getAllUsers(tenantId: string): Promise<UserResponseDTO[]>;
  createUser(tenantId: string, userData: CreateUserDTO): Promise<UserResponseDTO>;
  updateUserRole(userId: string, tenantId: string, roleNames: string[], requesterId?: string): Promise<UserResponseDTO | null>;
  updateUserPermissions(userId: string, tenantId: string, permissionNames: string[], requesterId?: string): Promise<UserResponseDTO | null>;
  deleteUser(userId: string, tenantId: string, requesterId?: string): Promise<boolean>;
}
