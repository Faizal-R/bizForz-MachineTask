import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { IAuthService } from "../interfaces/auth.service.interface";
import { RegisterTenantDTO, AuthResponseDTO, SigninDTO } from "dto/auth.dto";
import { ITenantRepository } from "repositories/interfaces/tenant.repository.interface";
import { IRoleRepository } from "repositories/interfaces/role.repository.interface";
import { IPermissionRepository } from "repositories/interfaces/permission.repository.interface";
import { slugify } from "helpers/slugify";
import { hashPassword } from "utils/hash";
import { CustomError } from "utils/custom-error";
import { statusCodes } from "constants/enums/statusCodes";
import { generateTokens } from "helpers/generateTokens";
import { AuthMapper } from "mappers/auth.mapper";

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
        statusCodes.BAD_REQUEST
      );
    }

    // Create slug from company name
    const slug = slugify(companyName);
    
    // Check if company (slug) is already registered
    const existingTenant = await this._tenantRepository.findOne({ slug });
    if (existingTenant) {
      throw new CustomError(
        "Company name is already registered.",
        statusCodes.BAD_REQUEST
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
      const systemPermissions = await this._permissionRepository.find({});
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

      return AuthMapper.toResponse(user,[adminRole],accessToken,refreshToken)
    } catch (error) {
      await this._tenantRepository.delete(tenant._id.toString());
      throw error;
    }
  }

  async signin(dto: SigninDTO): Promise<AuthResponseDTO> {
    // To be implemented
    throw new Error("Method not implemented.");
  }
}
