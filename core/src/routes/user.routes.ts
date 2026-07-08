import { resolve } from "../di/index.js";
import { Router } from "express";
import { IUserController } from "../controllers/interfaces/user.controller.interface.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { TYPES } from "../di/types.js";
import { Permissions } from "../constants/permissions.js";

const router: Router = Router();
const userController = resolve<IUserController>(TYPES.UserController);

router.use(protect);

router.get("/", authorize(Permissions.Users.READ), userController.getAll);
router.post("/", authorize(Permissions.Users.CREATE), userController.create);
router.put("/:userId/role", authorize(Permissions.Users.UPDATE), userController.updateRole);
router.put("/:userId/permissions", authorize(Permissions.Users.UPDATE), userController.updatePermissions);

export default router;