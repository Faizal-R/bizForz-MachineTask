export interface CreateUserDTO {
  name: string;
  email: string;
  password?: string;
  roles?: string[];
  customPermissions?: string[];
  status?: "active" | "inactive";
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
  customPermissions?: string[];
  status?: "active" | "inactive";
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  roles: string[];
  customPermissions: any[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
