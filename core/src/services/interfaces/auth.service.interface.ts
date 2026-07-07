import { AuthResponseDTO, SigninDTO, RegisterTenantDTO } from "dto/auth.dto";

export interface IAuthService {
  registerTenant(dto: RegisterTenantDTO): Promise<AuthResponseDTO>;
  signin(dto: SigninDTO): Promise<AuthResponseDTO>;
//   refresh(refreshToken: string): Promise<{ accessToken: string }>;
}