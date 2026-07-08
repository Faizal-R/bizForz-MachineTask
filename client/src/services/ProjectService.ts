import apiClient from "../config/apiClient";
import { parseAxiosError } from "../utils/ParseAxiosError";
import ApiRoutes from "../constants/ApiRoutes";

export const ProjectService = {
  getAll: async () => {
    try {
      const response = await apiClient.get(ApiRoutes.Projects.GET_ALL);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while fetching projects");
    }
  },

  create: async (project: any) => {
    try {
      const response = await apiClient.post(ApiRoutes.Projects.CREATE, project);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while creating project");
    }
  },

  update: async (id: string, project: any) => {
    try {
      const response = await apiClient.put(ApiRoutes.Projects.UPDATE(id), project);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while updating project");
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(ApiRoutes.Projects.DELETE(id));
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while deleting project");
    }
  },
};

export default ProjectService;
