import { resolve } from "../di";
import { Router } from "express";
import { IAuthController } from "../controllers/interfaces/auth.controller.interface";
import { validate } from "middlewares/validate";
import { registerTenantSchema, signinSchema } from "validations/AuthSchema";

import { TYPES } from "../di/types";

const router: Router = Router();

const authController = resolve<IAuthController>(TYPES.AuthController);

router.post("/register",validate(registerTenantSchema), authController.register);
router.post("/signin",validate(signinSchema),authController.signin)

export default router;