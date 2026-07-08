import { IProject } from "../../model/project.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IProjectRepository extends IBaseRepository<IProject> {
  findTenantProjects(tenantId: string): Promise<IProject[]>;
}
