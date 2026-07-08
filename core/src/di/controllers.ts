import container from "./index";
import { TYPES } from "./types";

// Controllers Interfaces
import { IAuthController } from "../controllers/interfaces/auth.controller.interface";

// Controllers Implements
import { AuthController } from "../controllers/auth.controller";

// Bind Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
