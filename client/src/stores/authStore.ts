import { create } from "zustand";
import AuthService from "@/services/AuthService";
import { performLogout } from "@/config/apiClient";

interface User {
  id: string;
  name: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  
  setUser: (user: User) => {
    set({ user, initialized: true, loading: false });
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const data = await AuthService.getMe();
      if (data && data.success) {
        set({ user: data.data, initialized: true, loading: false });
      } else {
        set({ user: null, initialized: true, loading: false });
      }
    } catch (error) {
      set({ user: null, initialized: true, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await performLogout();
    } finally {
      set({ user: null, loading: false, initialized: false });
    }
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    
    if (user.roles?.includes("Admin")) {
      return true;
    }
    
    return user.permissions?.includes(permission) || false;
  }
}));
