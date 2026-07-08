import container from "./index.js";
import { TYPES } from "./types.js";

// Controllers Interfaces
import { IAuthController } from "../controllers/interfaces/auth.controller.interface.js";
import { IRoleController } from "../controllers/interfaces/role.controller.interface.js";
import { IProjectController } from "../controllers/interfaces/project.controller.interface.js";
import { IUserController } from "../controllers/interfaces/user.controller.interface.js";
import { IPermissionController } from "../controllers/interfaces/permission.controller.interface.js";

// Controllers Implements
import { AuthController } from "../controllers/auth.controller.js";
import { RoleController } from "../controllers/role.controller.js";
import { ProjectController } from "../controllers/project.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { PermissionController } from "../controllers/permission.controller.js";

// Bind Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IRoleController>(TYPES.RoleController).to(RoleController).inSingletonScope();
container.bind<IProjectController>(TYPES.ProjectController).to(ProjectController).inSingletonScope();
container.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IPermissionController>(TYPES.PermissionController).to(PermissionController).inSingletonScope();
