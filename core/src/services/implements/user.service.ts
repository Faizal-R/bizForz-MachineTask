import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types.js";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface.js";
import { IRoleRepository } from "../../repositories/interfaces/role.repository.interface.js";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface.js";
import { IUserService } from "../interfaces/user.service.interface.js";
import { Types } from "mongoose";
import { hashPassword } from "../../utils/hash.js";
import { UserMapper } from "../../mappers/user.mapper.js";
import { UserResponseDTO, CreateUserDTO } from "../../dto/user.dto.js";
import { CustomError } from "../../utils/custom-error.js";
import { statusCodes } from "../../constants/enums/statusCodes.js";

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
      // Resolve the role ID by role name
      const roleName = userData.roles && userData.roles.length > 0 ? userData.roles[0] : "Employee";
      if (this.isAdminRoleName(roleName)) {
        throw new CustomError(
          "Admin users cannot be created from user management",
          statusCodes.FORBIDDEN,
        );
      }

      const hashedPassword = await hashPassword(userData.password!);

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

  async updateUserRole(userId: string, tenantId: string, roleNames: string[], requesterId?: string): Promise<UserResponseDTO | null> {
    try {
      // Prevent self-modification
      if (requesterId && requesterId === userId) {
        throw new CustomError(
          "You cannot modify your own role",
          statusCodes.FORBIDDEN,
        );
      }

      // Verify user belongs to tenant
      const user = await this._userRepository.findOne({ _id: userId, tenantId } as any);
      if (!user) {
        throw new CustomError(
          "User not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      // Admin users and assignments are reserved outside user management.
      const currentUserRoles = await this._roleRepository.findRolesByIds(user.roles as Types.ObjectId[]);
      const isTargetAdmin = currentUserRoles.some((r: any) => this.isAdminRoleName(r.name));
      const hasAdminRole = roleNames.some((roleName) => this.isAdminRoleName(roleName));

      if (isTargetAdmin) {
        throw new CustomError(
          "Admin users cannot be modified from user management",
          statusCodes.FORBIDDEN,
        );
      }

      if (hasAdminRole) {
        throw new CustomError(
          "Admin role cannot be assigned from user management",
          statusCodes.FORBIDDEN,
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

  async updateUserPermissions(userId: string, tenantId: string, permissionNames: string[], requesterId?: string): Promise<UserResponseDTO | null> {
    try {
      // Prevent self-modification
      if (requesterId && requesterId === userId) {
        throw new CustomError(
          "You cannot modify your own permissions",
          statusCodes.FORBIDDEN,
        );
      }

      // Verify user belongs to tenant
      const user = await this._userRepository.findOne({ _id: userId, tenantId } as any);
      if (!user) {
        throw new CustomError(
          "User not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      const targetRoles = await this._roleRepository.findRolesByIds(user.roles as Types.ObjectId[]);
      if (targetRoles.some((role: any) => this.isAdminRoleName(role.name))) {
        throw new CustomError(
          "Admin permission overrides cannot be modified from user management",
          statusCodes.FORBIDDEN,
        );
      }

      const normalizedPermissionNames = Array.isArray(permissionNames) ? permissionNames : [];

      // Resolve permission IDs (can be tenant-scoped or global/null tenantId)
      const permissions = await this._permissionRepository.find({
        name: { $in: normalizedPermissionNames },
        $or: [
          { tenantId: null },
          { tenantId: new Types.ObjectId(tenantId) },
        ],
      } as any);
      const permissionIds = permissions.map((p: any) => p._id as Types.ObjectId);

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

  async deleteUser(userId: string, tenantId: string, requesterId?: string): Promise<boolean> {
    try {
      // Prevent self-deletion
      if (requesterId && requesterId === userId) {
        throw new CustomError(
          "You cannot delete your own account",
          statusCodes.FORBIDDEN,
        );
      }

      // Verify user belongs to tenant
      const user = await this._userRepository.findOne({ _id: userId, tenantId } as any);
      if (!user) {
        throw new CustomError(
          "User not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      // Prevent deleting admin users
      const userRoles = await this._roleRepository.findRolesByIds(user.roles as Types.ObjectId[]);
      if (userRoles.some((role: any) => this.isAdminRoleName(role.name))) {
        throw new CustomError(
          "Admin users cannot be deleted from user management",
          statusCodes.FORBIDDEN,
        );
      }

      const deleted = await this._userRepository.delete(userId);
      if (!deleted) {
        throw new CustomError(
          "Failed to delete user",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      return true;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to delete user",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isAdminRoleName(roleName?: string): boolean {
    return roleName?.trim().toLowerCase() === "admin";
  }
}
