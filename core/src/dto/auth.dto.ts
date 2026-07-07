import { ITenant } from "model/tenant.model";
import { IUser } from "model/user.model";
import { TenantDTO } from "./tenant.dto";

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
    status: "active" | "inactive";
}

export interface AuthResponseDTO {
  user: AuthUserDTO;
  accessToken: string;
  refreshToken: string;
}