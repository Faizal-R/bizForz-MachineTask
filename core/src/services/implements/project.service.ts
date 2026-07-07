import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProjectRepository } from "../../repositories/interfaces/project.repository.interface";
import { IProjectService } from "../interfaces/project.service.interface";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject(TYPES.ProjectRepository) private _projectRepository: IProjectRepository
  ) {}
}
