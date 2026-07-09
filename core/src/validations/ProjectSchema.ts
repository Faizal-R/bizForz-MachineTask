import { z } from "zod";

const projectStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "on-hold",
]);

const membersSchema = z.array(
  z.string().trim().min(1, "Members cannot contain empty values"),
);

export const createAndUpdateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be minimum of 10 Characters")
    .trim()
    .max(500, "Description must be less than 500 characters"),
  status: projectStatusSchema.optional(),
  members: membersSchema.optional(),
});

