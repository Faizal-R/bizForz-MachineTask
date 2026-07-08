import { RequestHandler } from "express";

export interface IPermissionController{
    getAllPermissions:RequestHandler
}