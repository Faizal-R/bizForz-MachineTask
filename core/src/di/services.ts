import container from "./index.js";
import { TYPES } from "./types.js";

// Services Interfaces
import { IAuthService } from "../services/interfaces/auth.service.interface.js";
import { ITenantService } from "../services/interfaces/tenant.service.interface.js";
import { IUserService } from "../services/interfaces/user.service.interface.js";
import { IRoleService } from "../services/interfaces/role.service.interface.js";
import { IPermissionService } from "../services/interfaces/permission.service.interface.js";
import { IProjectService } from "../services/interfaces/project.service.interface.js";

// Services Implements
import { AuthService } from "../services/implements/auth.service.js";
import { TenantService } from "../services/implements/tenant.service.js";
import { UserService } from "../services/implements/user.service.js";
import { RoleService } from "../services/implements/role.service.js";
import { PermissionService } from "../services/implements/permission.service.js";
import { ProjectService } from "../services/implements/project.service.js";

// Bind Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<ITenantService>(TYPES.TenantService).to(TenantService).inSingletonScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IRoleService>(TYPES.RoleService).to(RoleService).inSingletonScope();
container.bind<IPermissionService>(TYPES.PermissionService).to(PermissionService).inSingletonScope();
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService).inSingletonScope();
