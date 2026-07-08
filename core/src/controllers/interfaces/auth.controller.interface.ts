import { RequestHandler } from "express";

export interface IAuthController {
    register: RequestHandler;
    signin: RequestHandler;
    me: RequestHandler;
}