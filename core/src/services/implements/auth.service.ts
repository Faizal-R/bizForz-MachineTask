import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { IAuthService } from "../interfaces/auth.service.interface";



@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}

  
}
