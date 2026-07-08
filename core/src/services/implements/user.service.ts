import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { IRoleRepository } from "../../repositories/interfaces/role.repository.interface";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { Types } from "mongoose";
import { hashPassword } from "../../utils/hash";
import { UserMapper } from "../../mappers/user.mapper";
import { UserResponseDTO, CreateUserDTO } from "../../dto/user.dto";
import { CustomError } from "utils/custom-error";
import { statusCodes } from "constants/enums/statusCodes";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.RoleRepository) private _roleRepository: IRoleRepository,
    @inject(TYPES.PermissionRepository) private _permissionRepository: IPermissionRepository
  ) {}

  async getAllUsers(tenantId: string): Promise<UserResponseDTO[]> {
    try {
      const users = await this._userRepository.findTenantUsers(tenantId);
      return users.map(u => UserMapper.toResponse(u));
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to fetch users",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(tenantId: string, userData: CreateUserDTO): Promise<UserResponseDTO> {
    try {
      const hashedPassword = await hashPassword(userData.password!);
      
      // Resolve the role ID by role name
      const roleName = userData.roles && userData.roles.length > 0 ? userData.roles[0] : "Employee";

      // Check if user with email already exists in tenant
      const existingUser = await this._userRepository.findByEmailAndTenant(userData.email, tenantId);
      if (existingUser) {
        throw new CustomError(
          "A user with this email already exists",
          statusCodes.CONFLICT,
        );
      }

      const role = await this._roleRepository.findByNameAndTenant(roleName, tenantId);
      if (!role) {
        throw new CustomError(
          `Role "${roleName}" not found for this tenant`,
          statusCodes.NOT_FOUND,
        );
      }
      const roleIds = [role._id as Types.ObjectId];

      const user = await this._userRepository.create({
        tenantId: new Types.ObjectId(tenantId),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        roles: roleIds,
        customPermissions: [],
        status: "active"
      } as any);
      const populatedUser = await this._userRepository.findByIdWithRelations(user._id.toString());
      return UserMapper.toResponse(populatedUser || user);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to create user",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserRole(userId: string, tenantId: string, roleNames: string[]): Promise<UserResponseDTO | null> {
    try {
      // Verify user belongs to tenant
      const user = await this._userRepository.findOne({ _id: userId, tenantId } as any);
      if (!user) {
        throw new CustomError(
          "User not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      // Resolve role IDs
      const roles = await this._roleRepository.find({
        tenantId: new Types.ObjectId(tenantId) as any,
        name: { $in: roleNames } as any
      });
      const roleIds = roles.map(r => r._id as Types.ObjectId);

      if (roleIds.length === 0) {
        throw new CustomError(
          "No valid roles found with the provided names",
          statusCodes.NOT_FOUND,
        );
      }

      const updatedUser = await this._userRepository.update(userId, { roles: roleIds });
      if (!updatedUser) {
        throw new CustomError(
          "Failed to update user roles",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      const populatedUser = await this._userRepository.findByIdWithRelations(updatedUser._id.toString());
      return UserMapper.toResponse(populatedUser || updatedUser);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to update user roles",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserPermissions(userId: string, tenantId: string, permissionNames: string[]): Promise<UserResponseDTO | null> {
    try {
      // Verify user belongs to tenant
      const user = await this._userRepository.findOne({ _id: userId, tenantId } as any);
      if (!user) {
        throw new CustomError(
          "User not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      // Resolve permission IDs (can be tenant-scoped or global/null tenantId)
      const permissions = await this._permissionRepository.find({
        name: { $in: permissionNames },
        $or: [
          { tenantId: null },
          { tenantId: new Types.ObjectId(tenantId) },
        ],
      } as any);
      const permissionIds = permissions.map(p => p._id as Types.ObjectId);

      const updatedUser = await this._userRepository.update(userId, { customPermissions: permissionIds });
      if (!updatedUser) {
        throw new CustomError(
          "Failed to update user permissions",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      const populatedUser = await this._userRepository.findByIdWithRelations(updatedUser._id.toString());
      return UserMapper.toResponse(populatedUser || updatedUser);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to update user permissions",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
