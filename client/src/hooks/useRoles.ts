import { useState, useCallback } from "react";
import RoleService from "../services/RoleService";

export const useRoles = () => {
  const [loading, setLoading] = useState(false);

  const getAllRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await RoleService.getAll();
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (role: any) => {
    setLoading(true);
    try {
      const response = await RoleService.create(role);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (id: string, role: any) => {
    setLoading(true);
    try {
      const response = await RoleService.update(id, role);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await RoleService.delete(id);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    loading,
  };
};
