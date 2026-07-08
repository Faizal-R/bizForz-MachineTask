import { inject, injectable } from "inversify";
import { IProjectController } from "./interfaces/project.controller.interface";
import { TYPES } from "di/types";
import { IProjectService } from "services/interfaces/project.service.interface";
import { Request, Response, RequestHandler } from "express";
import { tryCatch } from "handlers/try-catch";
import { createResponse } from "handlers/response-handler";
import { statusCodes } from "constants/enums/statusCodes";

@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject(TYPES.ProjectService) private readonly _projectService: IProjectService,
  ) {}

  getAll: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const projects = await this._projectService.getAllProjects(tenantId);
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Projects retrieved successfully",
        projects,
      );
    },
  );

  create: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const project = await this._projectService.createProject(tenantId, req.body);
      return createResponse(
        res,
        statusCodes.CREATED,
        true,
        "Project created successfully",
        project,
      );
    },
  );

  update: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { projectId } = req.params;
      const project = await this._projectService.updateProject(projectId as string, tenantId, req.body);
      if (!project) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "Project not found",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Project updated successfully",
        project,
      );
    },
  );

  delete: RequestHandler = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const tenantId = req.user!.tenantId;
      const { projectId } = req.params;
      const success = await this._projectService.deleteProject(projectId as string, tenantId);
      if (!success) {
        return createResponse(
          res,
          statusCodes.NOT_FOUND,
          false,
          "Project not found or deletion failed",
          null,
        );
      }
      return createResponse(
        res,
        statusCodes.SUCCESS,
        true,
        "Project deleted successfully",
        null,
      );
    },
  );
}
