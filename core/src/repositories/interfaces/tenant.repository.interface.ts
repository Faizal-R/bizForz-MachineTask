import { ITenant } from "../../model/tenant.model.js";
import { IBaseRepository } from "./base.repository.interface.js";

export interface ITenantRepository extends IBaseRepository<ITenant> {}
