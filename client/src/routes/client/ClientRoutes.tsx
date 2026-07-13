import React, { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { BoneSuspense } from "boneyard-js/react";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded pages
const SigninPage = lazy(() => import("../../pages/Auth/Signin"));
const RegisterPage = lazy(() => import("../../pages/Auth/Register"));
const DashboardPage = lazy(() => import("../../pages/Dashboard/Dashboard"));

const ClientRoutes: React.FC = () => {
  return (
    <BoneSuspense
      name="app-shell"
      animate="shimmer"
      transition={true}
      fallback={
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          color: "#7E8792",
          backgroundColor: "#F7F7F4"
        }}>
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BoneSuspense>
  );
};

export default ClientRoutes;
