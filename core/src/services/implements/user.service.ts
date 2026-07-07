import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}
}
