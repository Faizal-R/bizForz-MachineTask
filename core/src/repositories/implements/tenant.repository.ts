import { injectable } from "inversify";
import { BaseRepository } from "./base.repository.js";
import { ITenant, Tenant } from "../../model/tenant.model.js";
import { ITenantRepository } from "../interfaces/tenant.repository.interface.js";

@injectable()
export class TenantRepository extends BaseRepository<ITenant> implements ITenantRepository {
  constructor() {
    super(Tenant);
  }
}
