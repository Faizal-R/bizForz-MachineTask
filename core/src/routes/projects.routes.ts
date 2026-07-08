import { resolve } from "../di";
import { Router } from "express";
import { IProjectController } from "../controllers/interfaces/project.controller.interface";
import { authorize, protect } from "middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { Permissions } from "constants/permissions";

const router: Router = Router();
const projectController = resolve<IProjectController>(TYPES.ProjectController);

router.use(protect);

router.get("/", authorize(Permissions.Projects.READ), projectController.getAll);
router.post("/", authorize(Permissions.Projects.CREATE), projectController.create);
router.put("/:projectId", authorize(Permissions.Projects.UPDATE), projectController.update);
router.delete("/:projectId", authorize(Permissions.Projects.DELETE), projectController.delete);

export default router;
