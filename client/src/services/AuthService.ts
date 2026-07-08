import apiClient from "../config/apiClient";
import { parseAxiosError } from "../utils/ParseAxiosError";
import ApiRoutes from "../constants/ApiRoutes";

export const AuthService = {
  signIn: async (credentials: any) => {
    try {
      const response = await apiClient.post(ApiRoutes.Auth.SIGNIN, credentials);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred during login");
    }
  },

  register: async (details: any) => {
    try {
      const response = await apiClient.post(ApiRoutes.Auth.REGISTER, details);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "An error occurred during registration");
    }
  },

  getMe: async () => {
    try {
      const response = await apiClient.get(ApiRoutes.Auth.ME);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "Failed to fetch user session");
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post(ApiRoutes.Auth.LOGOUT);
      return response.data;
    } catch (error) {
      return parseAxiosError(error, "Logout failed");
    }
  },
};

export default AuthService;
