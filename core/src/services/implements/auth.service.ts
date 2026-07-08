import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { IAuthService } from "../interfaces/auth.service.interface";
import { RegisterTenantDTO, AuthResponseDTO, SigninDTO, AuthUserDTO } from "dto/auth.dto";
import { ITenantRepository } from "repositories/interfaces/tenant.repository.interface";
import { IRoleRepository } from "repositories/interfaces/role.repository.interface";
import { IPermissionRepository } from "repositories/interfaces/permission.repository.interface";
import { slugify } from "helpers/slugify";
import { comparePassword, hashPassword } from "utils/hash";
import { CustomError } from "utils/custom-error";
import { statusCodes } from "constants/enums/statusCodes";
import { generateTokens } from "helpers/generateTokens";
import { AuthMapper } from "mappers/auth.mapper";
import { Types } from "mongoose";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TYPES.RoleRepository)
    private readonly _roleRepository: IRoleRepository,
    @inject(TYPES.PermissionRepository)
    private readonly _permissionRepository: IPermissionRepository,
  ) {}

  async registerTenant(dto: RegisterTenantDTO): Promise<AuthResponseDTO> {
    const { companyName, adminName, email, password } = dto;

    // Check if email is already registered
    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) {
      throw new CustomError(
        "User email already exists. Please choose another email.",
        statusCodes.BAD_REQUEST,
      );
    }

    // Create slug from company name
    const slug = slugify(companyName);

    // Check if company (slug) is already registered
    const existingTenant = await this._tenantRepository.findOne({ slug });
    if (existingTenant) {
      throw new CustomError(
        "Company name is already registered.",
        statusCodes.BAD_REQUEST,
      );
    }

    //  Create Tenant
    const tenant = await this._tenantRepository.create({
      name: companyName,
      slug,
      status: "active",
    });

    try {
      //  Fetch all available system permissions to assign to the admin role
      const systemPermissions = await this._permissionRepository.find({ tenantId: null } as any);
      const permissionIds = systemPermissions.map((p) => p._id);

      // Create default Admin role for the Tenant
      const adminRole = await this._roleRepository.create({
        tenantId: tenant._id,
        name: "Admin",
        description: "Administrator with full access",
        permissions: permissionIds,
      });

      // Hash password & Create Admin User
      const hashedPassword = await hashPassword(password || "");
      const user = await this._userRepository.create({
        tenantId: tenant._id,
        name: adminName,
        email,
        password: hashedPassword,
        roles: [adminRole._id],
        customPermissions: [],
        status: "active",
      });

      //  Generate tokens
      const accessToken = generateTokens.accessToken({
        userId: user._id.toString(),
        tenantId: tenant._id.toString(),
        roles: ["Admin"],
      });

      const refreshToken = generateTokens.refreshToken({
        userId: user._id.toString(),
      });

     
      const populatedRoles = await this._roleRepository.findRolesByIds([adminRole._id]);

      return AuthMapper.toResponse(
        user,
        populatedRoles,
        accessToken,
        refreshToken,
      );
    } catch (error) {
      await this._tenantRepository.delete(tenant._id.toString());
      throw error;
    }
  }

  async signin(dto: SigninDTO): Promise<AuthResponseDTO> {
    try {
      const { email, password } = dto;

      const existingUser = await this._userRepository.findOne({ email });

      if (
        !existingUser ||
        !(await comparePassword(password!, existingUser.password!))
      ) {
        throw new CustomError(
          "We couldn't find an account with that email, or the password was incorrect. Please try again.",
          statusCodes.BAD_REQUEST,
        );
      }

      if (existingUser.status !== "active") {
        throw new CustomError(
          "Your user account has been deactivated. Please contact your company administrator for assistance.",
          statusCodes.FORBIDDEN,
        );
      }
      const tenant = await this._tenantRepository.findById(
        existingUser.tenantId.toString(),
      );
      if (!tenant || tenant.status !== "active") {
        throw new CustomError(
          "Your organization's account is currently suspended or inactive. Please contact system support.",
          statusCodes.FORBIDDEN,
        );
      }

      const userWithPermissions =
        await this._userRepository.findUserWithPermissions(existingUser._id.toString());
      const authUser = userWithPermissions || existingUser;
      const roles = userWithPermissions
        ? (userWithPermissions.roles as any)
        : await this._roleRepository.findRolesByIds(existingUser.roles as Types.ObjectId[]);

      const roleNames = roles.map((role: any) => role.name);

      const accessToken = generateTokens.accessToken({
        userId: existingUser._id.toString(),
        tenantId: existingUser.tenantId.toString(),
        roles: roleNames,
      });

      const refreshToken = generateTokens.refreshToken({
        userId: existingUser._id.toString(),
      });

      return AuthMapper.toResponse(
        authUser,
        roles,
        accessToken,
        refreshToken,
      );
    } catch (error) {
      throw error;
    }
  }

  async me(userId: string): Promise<AuthUserDTO> {
    try {
      const existingUser = await this._userRepository.findUserWithPermissions(userId);

      if (!existingUser) {
        throw new CustomError("User not found", statusCodes.NOT_FOUND);
      }

      if (existingUser.status !== "active") {
        throw new CustomError(
          "Your user account has been deactivated. Please contact your company administrator for assistance.",
          statusCodes.FORBIDDEN,
        );
      }

      const tenant = await this._tenantRepository.findById(
        existingUser.tenantId.toString(),
      );
      if (!tenant || tenant.status !== "active") {
        throw new CustomError(
          "Your organization's account is currently suspended or inactive. Please contact system support.",
          statusCodes.FORBIDDEN,
        );
      }

      const roles = existingUser.roles as any;

      return AuthMapper.toAuthUser(existingUser, roles);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to fetch user details",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
