import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IProject, Project } from "../../model/project.model";
import { IProjectRepository } from "../interfaces/project.repository.interface";

@injectable()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
  constructor() {
    super(Project);
  }
}
