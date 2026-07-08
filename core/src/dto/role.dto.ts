export interface CreateRoleDTO {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleResponseDTO {
  id: string;
  name: string;
  description?: string;
  permissions: any[]; 
  createdAt: Date;
  updatedAt: Date;
}
