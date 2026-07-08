import container from "./index";
import { TYPES } from "./types";

// Controllers Interfaces
import { IAuthController } from "../controllers/interfaces/auth.controller.interface";
import { IRoleController } from "../controllers/interfaces/role.controller.interface";
import { IProjectController } from "../controllers/interfaces/project.controller.interface";
import { IUserController } from "../controllers/interfaces/user.controller.interface";
import { IPermissionController } from "../controllers/interfaces/permission.controller.interface";

// Controllers Implements
import { AuthController } from "../controllers/auth.controller";
import { RoleController } from "../controllers/role.controller";
import { ProjectController } from "../controllers/project.controller";
import { UserController } from "../controllers/user.controller";
import { PermissionController } from "../controllers/permission.controller";

// Bind Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IRoleController>(TYPES.RoleController).to(RoleController).inSingletonScope();
container.bind<IProjectController>(TYPES.ProjectController).to(ProjectController).inSingletonScope();
container.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IPermissionController>(TYPES.PermissionController).to(PermissionController).inSingletonScope();
