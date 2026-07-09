import { resolve } from "../di/index.js";
import { Router } from "express";
import { IProjectController } from "../controllers/interfaces/project.controller.interface.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { TYPES } from "../di/types.js";
import { Permissions } from "../constants/permissions.js";
import { validate } from "../middlewares/validate.js";
import { createAndUpdateProjectSchema } from "../validations/ProjectSchema.js";

const router: Router = Router();
const projectController = resolve<IProjectController>(TYPES.ProjectController);

router.use(protect);

router.get("/", authorize(Permissions.Projects.READ), projectController.getAll);
router.post("/", authorize(Permissions.Projects.CREATE), validate(createAndUpdateProjectSchema), projectController.create);
router.put("/:projectId", authorize(Permissions.Projects.UPDATE), validate(createAndUpdateProjectSchema), projectController.update);
router.delete("/:projectId", authorize(Permissions.Projects.DELETE), projectController.delete);

export default router;
