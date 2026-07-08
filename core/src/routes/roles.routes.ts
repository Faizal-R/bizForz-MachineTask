import { resolve } from "../di";
import { Router } from "express";
import { IRoleController } from "../controllers/interfaces/role.controller.interface";
import { authorize, protect } from "middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { Permissions } from "constants/permissions";

const router: Router = Router();
const roleController = resolve<IRoleController>(TYPES.RoleController);

router.use(protect);

router.get("/", authorize(Permissions.Roles.READ), roleController.getAll);
router.post("/", authorize(Permissions.Roles.CREATE), roleController.create);
router.put("/:roleId", authorize(Permissions.Roles.UPDATE), roleController.update);
router.delete("/:roleId", authorize(Permissions.Roles.DELETE), roleController.delete);

export default router;
