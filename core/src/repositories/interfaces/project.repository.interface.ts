import { IProject } from "../../model/project.model.js";
import { IBaseRepository } from "./base.repository.interface.js";

export interface IProjectRepository extends IBaseRepository<IProject> {
  findTenantProjects(tenantId: string): Promise<IProject[]>;
}
