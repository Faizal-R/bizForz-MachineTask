import container from "./index.js";
import { TYPES } from "./types.js";

// Repositories Interfaces
import { ITenantRepository } from "../repositories/interfaces/tenant.repository.interface.js";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface.js";
import { IRoleRepository } from "../repositories/interfaces/role.repository.interface.js";
import { IPermissionRepository } from "../repositories/interfaces/permission.repository.interface.js";
import { IProjectRepository } from "../repositories/interfaces/project.repository.interface.js";

// Repositories Implements
import { TenantRepository } from "../repositories/implements/tenant.repository.js";
import { UserRepository } from "../repositories/implements/user.repository.js";
import { RoleRepository } from "../repositories/implements/role.repository.js";
import { PermissionRepository } from "../repositories/implements/permission.repository.js";
import { ProjectRepository } from "../repositories/implements/project.repository.js";

// Bind Repositories
container.bind<ITenantRepository>(TYPES.TenantRepository).to(TenantRepository).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository).inSingletonScope();
container.bind<IPermissionRepository>(TYPES.PermissionRepository).to(PermissionRepository).inSingletonScope();
container.bind<IProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository).inSingletonScope();
