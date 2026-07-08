import { resolve } from "../di/index.js";
import { Router } from "express";
import { IAuthController } from "../controllers/interfaces/auth.controller.interface.js";
import { validate } from "../middlewares/validate.js";
import { registerTenantSchema, signinSchema } from "../validations/AuthSchema.js";
import { protect } from "../middlewares/auth.middleware.js";

import { TYPES } from "../di/types.js";

const router: Router = Router();

const authController = resolve<IAuthController>(TYPES.AuthController);

router.post("/register",validate(registerTenantSchema), authController.register);
router.post("/signin",validate(signinSchema),authController.signin)
router.post("/logout", authController.logout);
router.get("/me", protect, authController.me);

export default router;
