export const Permissions = {
  Projects: {
    CREATE: "create:projects",
    READ: "read:projects",
    UPDATE: "update:projects",
    DELETE: "delete:projects",
  },
  Roles: {
    CREATE: "create:roles",
    READ: "read:roles",
    UPDATE: "update:roles",
    DELETE: "delete:roles",
  },
  Users: {
    CREATE: "create:users",
    READ: "read:users",
    UPDATE: "update:users",
    DELETE: "delete:users",
  },
  Permissions: {
    READ: "read:permissions",
  },
} as const;

export const PermissionValues = [
  Permissions.Projects.CREATE,
  Permissions.Projects.READ,
  Permissions.Projects.UPDATE,
  Permissions.Projects.DELETE,
  Permissions.Roles.CREATE,
  Permissions.Roles.READ,
  Permissions.Roles.UPDATE,
  Permissions.Roles.DELETE,
  Permissions.Users.CREATE,
  Permissions.Users.READ,
  Permissions.Users.UPDATE,
  Permissions.Users.DELETE,
  Permissions.Permissions.READ,
] as const;

export type PermissionName = (typeof PermissionValues)[number];
