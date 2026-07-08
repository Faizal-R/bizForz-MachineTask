import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types.js";
import { ITenantRepository } from "../../repositories/interfaces/tenant.repository.interface.js";
import { ITenantService } from "../interfaces/tenant.service.interface.js";

@injectable()
export class TenantService implements ITenantService {
  constructor(
    @inject(TYPES.TenantRepository) private _tenantRepository: ITenantRepository
  ) {}
}
