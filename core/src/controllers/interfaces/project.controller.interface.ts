import { RequestHandler } from "express";

export interface IProjectController {
  getAll: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}
