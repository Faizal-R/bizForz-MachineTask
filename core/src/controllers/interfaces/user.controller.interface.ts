import { RequestHandler } from "express";

export interface IUserController {
  getAll: RequestHandler;
  create: RequestHandler;
  updatePermissions: RequestHandler;
  updateRole: RequestHandler;
}
