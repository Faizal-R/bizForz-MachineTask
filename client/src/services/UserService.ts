import apiClient from "../config/apiClient";
import { parseAxiosError } from "../utils/ParseAxiosError";
import ApiRoutes from "../constants/ApiRoutes";

export const UserService = {
  getAll: async () => {
    try {
      const response = await apiClient.get(ApiRoutes.Users.GET_ALL);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while fetching users");
    }
  },

  create: async (user: any) => {
    try {
      const response = await apiClient.post(ApiRoutes.Users.CREATE, user);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while creating user");
    }
  },

  updatePermissions: async (id: string, permissions: string[]) => {
    try {
      const response = await apiClient.put(ApiRoutes.Users.UPDATE_PERMISSIONS(id), { permissions });
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while updating user permissions");
    }
  },

  updateRole: async (id: string, roles: string[]) => {
    try {
      const response = await apiClient.put(ApiRoutes.Users.UPDATE_ROLE(id), { roles });
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while updating user role");
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(ApiRoutes.Users.DELETE(id));
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred while deleting user");
    }
  },
};

export default UserService;
