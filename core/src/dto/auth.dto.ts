import { ITenant } from "../model/tenant.model.js";
import { IUser } from "../model/user.model.js";
import { TenantDTO } from "./tenant.dto.js";

export interface RegisterTenantDTO{
  companyName: string;
  adminName: string;
  email: string;
  password?: string;
}
export interface SigninDTO {
  email: string;
  password?: string;
}

export interface AuthUserDTO {
    id: string;
    tenantId: string;
    name: string;
    roles: string[];
    permissions: string[];  // Resolved permission keys e.g. ["create:projects", "read:users"]
    status: "active" | "inactive";
}

export interface AuthResponseDTO {
  user: AuthUserDTO;
  accessToken: string;
  refreshToken: string;
}