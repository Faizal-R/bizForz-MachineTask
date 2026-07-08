import { resolve } from "../di";
import { Router } from "express";
import { IUserController } from "../controllers/interfaces/user.controller.interface";
import { authorize, protect } from "middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { Permissions } from "constants/permissions";

const router: Router = Router();
const userController = resolve<IUserController>(TYPES.UserController);

router.use(protect);

router.get("/", authorize(Permissions.Users.READ), userController.getAll);
router.post("/", authorize(Permissions.Users.CREATE), userController.create);
router.put("/:userId/role", authorize(Permissions.Users.UPDATE), userController.updateRole);
router.put("/:userId/permissions", authorize(Permissions.Users.UPDATE), userController.updatePermissions);

export default router;
