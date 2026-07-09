import { z } from "zod";

const permissionsSchema = z
  .array(z.string().trim().min(1, "Permissions cannot contain empty values"))
  .min(1, "The role should at least have 1 permissions");

export const createAndUpdateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description must be at least 10 characters")
    .max(250, "Description must be less than 250 characters"),
  permissions: permissionsSchema.default([]),
});


