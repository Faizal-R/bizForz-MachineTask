import container from "./index";
import { TYPES } from "./types";

// Repositories Interfaces
import { ITenantRepository } from "../repositories/interfaces/tenant.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IRoleRepository } from "../repositories/interfaces/role.repository.interface";
import { IPermissionRepository } from "../repositories/interfaces/permission.repository.interface";
import { IProjectRepository } from "../repositories/interfaces/project.repository.interface";

// Repositories Implements
import { TenantRepository } from "../repositories/implements/tenant.repository";
import { UserRepository } from "../repositories/implements/user.repository";
import { RoleRepository } from "../repositories/implements/role.repository";
import { PermissionRepository } from "../repositories/implements/permission.repository";
import { ProjectRepository } from "../repositories/implements/project.repository";

// Bind Repositories
container.bind<ITenantRepository>(TYPES.TenantRepository).to(TenantRepository).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository).inSingletonScope();
container.bind<IPermissionRepository>(TYPES.PermissionRepository).to(PermissionRepository).inSingletonScope();
container.bind<IProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository).inSingletonScope();
