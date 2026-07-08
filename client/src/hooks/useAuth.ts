import { useState, useCallback } from "react";
import AuthService from "../services/AuthService";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (credentials: {email:string,password:string}) => {
    setLoading(true);
    try {
      const response = await AuthService.signIn(credentials);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signIn, loading };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (details: any) => {
    setLoading(true);
    try {
      const response = await AuthService.register(details);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading };
};

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      // Redirect to signin — backend clears HTTP-only cookie on logout endpoint
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { signOut, loading };
};
