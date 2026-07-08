import { resolve } from "../di/index.js";
import { Router } from "express";
import { IRoleController } from "../controllers/interfaces/role.controller.interface.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { TYPES } from "../di/types.js";
import { Permissions } from "../constants/permissions.js";

const router: Router = Router();
const roleController = resolve<IRoleController>(TYPES.RoleController);

router.use(protect);

router.get("/", authorize(Permissions.Roles.READ), roleController.getAll);
router.post("/", authorize(Permissions.Roles.CREATE), roleController.create);
router.put("/:roleId", authorize(Permissions.Roles.UPDATE), roleController.update);
router.delete("/:roleId", authorize(Permissions.Roles.DELETE), roleController.delete);

export default router;