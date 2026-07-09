import { z } from "zod";

const permissionsSchema = z.array(
  z.string().trim().min(1, "Permissions cannot contain empty values"),
);

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .trim()
    .max(250, "Description must be less than 250 characters")
    .optional(),
  permissions: permissionsSchema.default([]),
});

export const updateRoleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Role name must be at least 2 characters")
      .max(50, "Role name must be less than 50 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(250, "Description must be less than 250 characters")
      .optional(),
    permissions: permissionsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one role field is required",
  });
