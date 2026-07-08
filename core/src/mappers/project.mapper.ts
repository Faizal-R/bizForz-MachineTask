import { IProject } from "../model/project.model";
import { ProjectResponseDTO } from "../dto/project.dto";

export class ProjectMapper {
  static toResponse(project: IProject): ProjectResponseDTO {
    return {
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      members: project.members, 
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
