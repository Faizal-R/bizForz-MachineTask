import { IProject } from "../../model/project.model";
import { ProjectResponseDTO, CreateProjectDTO, UpdateProjectDTO } from "../../dto/project.dto";

export interface IProjectService {
  getAllProjects(tenantId: string): Promise<ProjectResponseDTO[]>;
  createProject(tenantId: string, projectData: CreateProjectDTO): Promise<ProjectResponseDTO>;
  updateProject(projectId: string, tenantId: string, projectData: UpdateProjectDTO): Promise<ProjectResponseDTO | null>;
  deleteProject(projectId: string, tenantId: string): Promise<boolean>;
}
