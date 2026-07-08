import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types.js";
import { IProjectRepository } from "../../repositories/interfaces/project.repository.interface.js";
import { IProjectService } from "../interfaces/project.service.interface.js";
import { Types } from "mongoose";
import { ProjectMapper } from "../../mappers/project.mapper.js";
import { ProjectResponseDTO, CreateProjectDTO, UpdateProjectDTO } from "../../dto/project.dto.js";
import { CustomError } from "../../utils/custom-error.js";
import { statusCodes } from "../../constants/enums/statusCodes.js";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject(TYPES.ProjectRepository) private _projectRepository: IProjectRepository
  ) {}

  async getAllProjects(tenantId: string): Promise<ProjectResponseDTO[]> {
    try {
      const projects = await this._projectRepository.findTenantProjects(tenantId);
      return projects.map(p => ProjectMapper.toResponse(p));
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to fetch projects",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProject(tenantId: string, projectData: CreateProjectDTO): Promise<ProjectResponseDTO> {
    try {
      const project = await this._projectRepository.create({
        ...projectData,
        tenantId: new Types.ObjectId(tenantId)
      } as any);
      return ProjectMapper.toResponse(project);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to create project",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProject(projectId: string, tenantId: string, projectData: UpdateProjectDTO): Promise<ProjectResponseDTO | null> {
    try {
      // Validate project belongs to tenant
      const project = await this._projectRepository.findOne({ _id: projectId, tenantId } as any);
      if (!project) {
        throw new CustomError(
          "Project not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }

      const updatedProject = await this._projectRepository.update(projectId, projectData);
      if (!updatedProject) {
        throw new CustomError(
          "Failed to update project",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      return ProjectMapper.toResponse(updatedProject);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to update project",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProject(projectId: string, tenantId: string): Promise<boolean> {
    try {
      const project = await this._projectRepository.findOne({ _id: projectId, tenantId } as any);
      if (!project) {
        throw new CustomError(
          "Project not found or does not belong to this tenant",
          statusCodes.NOT_FOUND,
        );
      }
      return this._projectRepository.delete(projectId);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to delete project",
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
