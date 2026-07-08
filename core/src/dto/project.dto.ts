export interface CreateProjectDTO {
  name: string;
  description?: string;
  status?: "planning" | "active" | "completed" | "on-hold";
  members?: string[];
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: "planning" | "active" | "completed" | "on-hold";
  members?: string[];
}

export interface ProjectResponseDTO {
  id: string;
  name: string;
  description?: string;
  status: "planning" | "active" | "completed" | "on-hold";
  members: any[];
  createdAt: Date;
  updatedAt: Date;
}
