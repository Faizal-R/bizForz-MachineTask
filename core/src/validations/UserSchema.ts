import { z } from "zod";

const stringListSchema = (fieldName: string) =>
  z
    .array(z.string().trim().min(1, `${fieldName} cannot contain empty values`))
    .min(1, `${fieldName} must contain at least one value`).optional();

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1,"Email is required")
    .trim()
    .email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  roles: stringListSchema("Roles").optional(),
  // customPermissions: stringListSchema("Custom permissions").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateUserRoleSchema = z.object({
  roles: stringListSchema("Roles"),
});

export const updateUserPermissionsSchema = z.object({
  permissions: z
    .array(z.string().trim().min(1, "Permissions cannot contain empty values"))
    .default([]),
});
