import { AuthResponseDTO, SigninDTO, RegisterTenantDTO, AuthUserDTO } from "dto/auth.dto";

export interface IAuthService {
  registerTenant(dto: RegisterTenantDTO): Promise<AuthResponseDTO>;
  signin(dto: SigninDTO): Promise<AuthResponseDTO>;
  me(userId: string): Promise<AuthUserDTO>;
//   refresh(refreshToken: string): Promise<{ accessToken: string }>;
}