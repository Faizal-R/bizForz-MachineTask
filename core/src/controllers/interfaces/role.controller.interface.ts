import { RequestHandler } from "express";

export interface IRoleController {
  getAll: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}