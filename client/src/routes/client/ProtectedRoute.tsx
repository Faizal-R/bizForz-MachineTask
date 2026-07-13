import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { user, loading, initialized, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      fetchUser();
    }
  }, [initialized, fetchUser]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#08060d] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
