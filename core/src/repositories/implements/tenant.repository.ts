import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { ITenant, Tenant } from "../../model/tenant.model";
import { ITenantRepository } from "../interfaces/tenant.repository.interface";

@injectable()
export class TenantRepository extends BaseRepository<ITenant> implements ITenantRepository {
  constructor() {
    super(Tenant);
  }
}
