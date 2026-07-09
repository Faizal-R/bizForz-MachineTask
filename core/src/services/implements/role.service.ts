import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types.js";
import { IRoleRepository } from "../../repositories/interfaces/role.repository.interface.js";
import { IPermissionRepository } from "../../repositories/interfaces/permission.repository.interface.js";
import { IRoleService } from "../interfaces/role.service.interface.js";
import { Types } from "mongoose";
import { RoleMapper } from "../../mappers/role.mapper.js";
import { RoleResponseDTO, CreateRoleDTO, UpdateRoleDTO } from "../../dto/role.dto.js";
import { CustomError } from "../../utils/custom-error.js";
import { statusCodes } from "../../constants/enums/statusCodes.js";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.RoleRepository) private _roleRepository: IRoleRepository,
    @inject(TYPES.PermissionRepository) private _permissionRepository: IPermissionRepository
  ) {}

  async getAllRoles(tenantId: string): Promise<RoleResponseDTO[]> {
    try {
      const roles = await this._roleRepository.findTenantRoles(tenantId);
      return roles
        .filter(role => !this.isAdminRoleName(role.name))
        .map(role => RoleMapper.toResponse(role));
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to fetch roles",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRole(tenantId: string, roleData: CreateRoleDTO): Promise<RoleResponseDTO> {
    try {
      if (this.isAdminRoleName(roleData.name)) {
        throw new CustomError(
          "Admin role is reserved and cannot be created",
          statusCodes.FORBIDDEN,
        );
      }

      const permissions = await this._permissionRepository.find({
        name: { $in: roleData.permissions || [] },
        $or: [
          { tenantId: null },
          { tenantId: new Types.ObjectId(tenantId) },
        ],
      } as any);
      const permissionIds = permissions.map(p => p._id as Types.ObjectId);

      const role = await this._roleRepository.create({
        tenantId: new Types.ObjectId(tenantId),
        name: roleData.name,
        description: roleData.description,
        permissions: permissionIds
      } as any);
      role.permissions = permissions as any;
      
      return RoleMapper.toResponse(role);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to create role",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRole(roleId: string, tenantId: string, roleData: UpdateRoleDTO): Promise<RoleResponseDTO | null> {
    try {
      // Validate role belongs to tenant
      const role = await this._roleRepository.findOne({ _id: roleId, tenantId } as any);
      if (!role) {
        throw new CustomError(
          "Role not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      if (this.isAdminRoleName(role.name) || this.isAdminRoleName(roleData.name)) {
        throw new CustomError(
          "Admin role is reserved and cannot be modified",
          statusCodes.FORBIDDEN,
        );
      }

      const permissions = await this._permissionRepository.find({
        name: { $in: roleData.permissions || [] },
        $or: [
          { tenantId: null },
          { tenantId: new Types.ObjectId(tenantId) },
        ],
      } as any);
      const permissionIds = permissions.map(p => p._id as Types.ObjectId);

      const updatedRole = await this._roleRepository.update(roleId, {
        name: roleData.name,
        description: roleData.description,
        permissions: permissionIds
      });
      
      if (!updatedRole) {
        throw new CustomError(
          "Failed to update role",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      updatedRole.permissions = permissions as any;
      return RoleMapper.toResponse(updatedRole);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to update role",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRole(roleId: string, tenantId: string): Promise<boolean> {
    try {
      const role = await this._roleRepository.findOne({ _id: roleId, tenantId });
      if (!role) {
        throw new CustomError(
          "Role not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }
      if (this.isAdminRoleName(role.name)) {
        throw new CustomError(
          "Admin role is reserved and cannot be deleted",
          statusCodes.FORBIDDEN,
        );
      }
      return this._roleRepository.delete(roleId);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to delete role",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isAdminRoleName(roleName?: string): boolean {
    return roleName?.trim().toLowerCase() === "admin";
  }
}