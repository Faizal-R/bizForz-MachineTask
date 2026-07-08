import { useState, useCallback } from "react";
import ProjectService from "../services/ProjectService";

export const useProjects = () => {
  const [loading, setLoading] = useState(false);

  const getAllProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ProjectService.getAll();
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (project: any) => {
    setLoading(true);
    try {
      const response = await ProjectService.create(project);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, project: any) => {
    setLoading(true);
    try {
      const response = await ProjectService.update(id, project);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await ProjectService.delete(id);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    loading,
  };
};
