import { resolve } from "../di";
import { Router } from "express";
import { IPermissionController } from "../controllers/interfaces/permission.controller.interface";
import { authorize, protect } from "middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { Permissions } from "constants/permissions";

const router: Router = Router();
const permissionController = resolve<IPermissionController>(TYPES.PermissionController);

router.use(protect);

router.get("/", authorize(Permissions.Permissions.READ), permissionController.getAllPermissions);

export default router;
