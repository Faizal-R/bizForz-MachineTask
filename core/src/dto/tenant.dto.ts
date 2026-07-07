export interface TenantDTO {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}