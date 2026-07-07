import { resolve } from "../di";
import { Router } from "express";
import { IAuthController } from "../controllers/interfaces/auth.controller.interface";
import { validate } from "middlewares/validate";
import { registerTenantSchema } from "validations/AuthSchema";

const router: Router = Router();

const authController = resolve<IAuthController>("AuthController");

router.post("/register",validate(registerTenantSchema), authController.register);

export default router;