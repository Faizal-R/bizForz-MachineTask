import { resolve } from "../di/index.js";
import { Router } from "express";
import { IPermissionController } from "../controllers/interfaces/permission.controller.interface.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { TYPES } from "../di/types.js";
import { Permissions } from "../constants/permissions.js";

const router: Router = Router();
const permissionController = resolve<IPermissionController>(
  TYPES.PermissionController,
);

router.use(protect);

router.get(
  "/",
  authorize(Permissions.Permissions.READ),
  permissionController.getAllPermissions,
);

export default router;
