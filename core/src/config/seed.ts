import { Permission } from "../model/permission.model";
import { Permissions } from "../constants/permissions";

export const DEFAULT_PERMISSIONS = [
  // Projects
  { name: Permissions.Projects.CREATE, category: "Project", description: "Ability to create new projects" },
  { name: Permissions.Projects.READ, category: "Project", description: "Ability to view projects" },
  { name: Permissions.Projects.UPDATE, category: "Project", description: "Ability to edit projects" },
  { name: Permissions.Projects.DELETE, category: "Project", description: "Ability to delete projects" },

  // Roles
  { name: Permissions.Roles.CREATE, category: "Role", description: "Ability to create roles" },
  { name: Permissions.Roles.READ, category: "Role", description: "Ability to view roles" },
  { name: Permissions.Roles.UPDATE, category: "Role", description: "Ability to update roles" },
  { name: Permissions.Roles.DELETE, category: "Role", description: "Ability to delete roles" },

  // Permissions
  { name: Permissions.Permissions.READ, category: "Permission", description: "Ability to view permissions" },

  // Users
  { name: Permissions.Users.CREATE, category: "User", description: "Ability to create users" },
  { name: Permissions.Users.READ, category: "User", description: "Ability to view users" },
  { name: Permissions.Users.UPDATE, category: "User", description: "Ability to update users" },
  { name: Permissions.Users.DELETE, category: "User", description: "Ability to delete users" },
];

export const seedPermissions = async (): Promise<void> => {
  try {
    console.log("Seeding default permissions...");
    for (const perm of DEFAULT_PERMISSIONS) {
      // Check if permission already exists as a global permission (tenantId: null)
      const existing = await Permission.findOne({ name: perm.name, tenantId: null });
      if (!existing) {
        await Permission.create({
          name: perm.name,
          category: perm.category,
          description: perm.description,
          tenantId: null,
        });
        console.log(`Created permission: ${perm.name}`);
      }
    }
    console.log("Permission seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};
