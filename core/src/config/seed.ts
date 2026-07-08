import { Permission } from "../model/permission.model";

export const DEFAULT_PERMISSIONS = [
  // Projects
  { name: "create:projects", category: "Project", description: "Ability to create new projects" },
  { name: "read:projects", category: "Project", description: "Ability to view projects" },
  { name: "update:projects", category: "Project", description: "Ability to edit projects" },
  { name: "delete:projects", category: "Project", description: "Ability to delete projects" },

  // Roles
  { name: "create:roles", category: "Role", description: "Ability to create roles" },
  { name: "read:roles", category: "Role", description: "Ability to view roles" },
  { name: "update:roles", category: "Role", description: "Ability to update roles" },
  { name: "delete:roles", category: "Role", description: "Ability to delete roles" },

  // Users
  { name: "create:users", category: "User", description: "Ability to create users" },
  { name: "read:users", category: "User", description: "Ability to view users" },
  { name: "update:users", category: "User", description: "Ability to update users" },
  { name: "delete:users", category: "User", description: "Ability to delete users" },
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
