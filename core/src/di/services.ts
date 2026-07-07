import container from "./index";
import { TYPES } from "./types";

// Services Interfaces
import { IAuthService } from "../services/interfaces/auth.service.interface";
import { ITenantService } from "../services/interfaces/tenant.service.interface";
import { IUserService } from "../services/interfaces/user.service.interface";
import { IRoleService } from "../services/interfaces/role.service.interface";
import { IPermissionService } from "../services/interfaces/permission.service.interface";
import { IProjectService } from "../services/interfaces/project.service.interface";

// Services Implements
import { AuthService } from "../services/implements/auth.service";
import { TenantService } from "../services/implements/tenant.service";
import { UserService } from "../services/implements/user.service";
import { RoleService } from "../services/implements/role.service";
import { PermissionService } from "../services/implements/permission.service";
import { ProjectService } from "../services/implements/project.service";

// Bind Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<ITenantService>(TYPES.TenantService).to(TenantService).inSingletonScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IRoleService>(TYPES.RoleService).to(RoleService).inSingletonScope();
container.bind<IPermissionService>(TYPES.PermissionService).to(PermissionService).inSingletonScope();
container.bind<IProjectService>(TYPES.ProjectService).to(ProjectService).inSingletonScope();
