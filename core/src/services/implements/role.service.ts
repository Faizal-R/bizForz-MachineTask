import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IRoleRepository } from "../../repositories/interfaces/role.repository.interface";
import { IRoleService } from "../interfaces/role.service.interface";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.RoleRepository) private _roleRepository: IRoleRepository
  ) {}
}
