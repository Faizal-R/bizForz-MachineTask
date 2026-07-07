import { z } from "zod";

export const registerTenantSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  adminName: z
    .string()
    .min(2, "Admin name must be at least 2 characters")
    .max(50, "Admin name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),
});
