export const TYPES = {
  // Repositories
  TenantRepository: Symbol.for("TenantRepository"),
  UserRepository: Symbol.for("UserRepository"),
  RoleRepository: Symbol.for("RoleRepository"),
  PermissionRepository: Symbol.for("PermissionRepository"),
  ProjectRepository: Symbol.for("ProjectRepository"),

  // Services
  AuthService: Symbol.for("AuthService"),
  TenantService: Symbol.for("TenantService"),
  UserService: Symbol.for("UserService"),
  RoleService: Symbol.for("RoleService"),
  PermissionService: Symbol.for("PermissionService"),
  ProjectService: Symbol.for("ProjectService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  TenantController: Symbol.for("TenantController"),
  UserController: Symbol.for("UserController"),
  RoleController: Symbol.for("RoleController"),
  PermissionController: Symbol.for("PermissionController"),
  ProjectController: Symbol.for("ProjectController"),
};