import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IProject, Project } from "../../model/project.model";
import { IProjectRepository } from "../interfaces/project.repository.interface";
import { Types } from "mongoose";

@injectable()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
  constructor() {
    super(Project);
  }

  async findTenantProjects(tenantId: string): Promise<IProject[]> {
    return this.model
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate("members")
      .exec();
  }
}
