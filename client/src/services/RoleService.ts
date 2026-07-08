import apiClient from "../config/apiClient";
import { parseAxiosError } from "../utils/ParseAxiosError";
import ApiRoutes from "../constants/ApiRoutes";

export const RoleService = {
  getAll: async () => {
    try {
      const response = await apiClient.get(ApiRoutes.Roles.GET_ALL);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while fetching roles");
    }
  },

  create: async (role: any) => {
    try {
      const response = await apiClient.post(ApiRoutes.Roles.CREATE, role);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while creating role");
    }
  },

  update: async (id: string, role: any) => {
    try {
      const response = await apiClient.put(ApiRoutes.Roles.UPDATE(id), role);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while updating role");
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(ApiRoutes.Roles.DELETE(id));
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while deleting role");
    }
  },
};

export default RoleService;
