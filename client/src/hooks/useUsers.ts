import { useState, useCallback } from "react";
import UserService from "../services/UserService";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getAll();
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: any) => {
    setLoading(true);
    try {
      const response = await UserService.create(user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserPermissions = useCallback(async (id: string, permissions: string[]) => {
    setLoading(true);
    try {
      const response = await UserService.updatePermissions(id, permissions);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (id: string, roles: string[]) => {
    setLoading(true);
    try {
      const response = await UserService.updateRole(id, roles);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await UserService.delete(id);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllUsers,
    createUser,
    updateUserPermissions,
    updateUserRole,
    deleteUser,
    loading,
  };
};
