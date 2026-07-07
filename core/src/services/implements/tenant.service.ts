import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ITenantRepository } from "../../repositories/interfaces/tenant.repository.interface";
import { ITenantService } from "../interfaces/tenant.service.interface";

@injectable()
export class TenantService implements ITenantService {
  constructor(
    @inject(TYPES.TenantRepository) private _tenantRepository: ITenantRepository
  ) {}
}
