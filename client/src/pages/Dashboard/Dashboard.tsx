import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsView from "@/components/features/dashboard/ProjectsView";
import UsersView from "@/components/features/dashboard/UsersView";
import RolesView from "@/components/features/dashboard/RolesView";
import { useAuthStore } from "@/stores/authStore";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"projects" | "users" | "roles">("projects");
  const { user, loading, initialized, fetchUser, logout, hasPermission } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      fetchUser();
    } else if (!loading && !user) {
      navigate("/signin");
    }
  }, [initialized, loading, user, fetchUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  if (!initialized || loading || !user) {
    return (
      <div className="min-h-screen bg-[#08060d] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm font-semibold">Loading Dashboard...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#08060d] text-white flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#110e1a] border-r border-neutral-800 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1726] flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-primary-main" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">Bizforz</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === "projects"
                  ? "bg-primary-main text-secondary-dark shadow-lg shadow-primary-main/20"
                  : "text-gray-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Projects Board
            </button>

            {hasPermission("read:users") && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === "users"
                    ? "bg-primary-main text-secondary-dark shadow-lg shadow-primary-main/20"
                    : "text-gray-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users & Overrides
              </button>
            )}

            {hasPermission("read:roles") && (
              <button
                onClick={() => setActiveTab("roles")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === "roles"
                    ? "bg-primary-main text-secondary-dark shadow-lg shadow-primary-main/20"
                    : "text-gray-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Role Management
              </button>
            )}
          </nav>
        </div>

        {/* User Details & Logout */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-main/20 text-primary-main flex items-center justify-center font-bold border border-primary-main/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user.roles?.[0] || "User"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-[#110e1a]/80 backdrop-blur-md border-b border-neutral-800 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              {activeTab === "projects" && "Projects Directory"}
              {activeTab === "users" && "Organization Directory"}
              {activeTab === "roles" && "Workspace Settings"}
            </h2>
            <p className="text-xs text-gray-400">
              {activeTab === "projects" && "Manage organization deliverables and boards"}
              {activeTab === "users" && "Manage team members and permission overrides"}
              {activeTab === "roles" && "Define system roles and access lists"}
            </p>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 flex-grow">
          {activeTab === "projects" && <ProjectsView hasPermission={hasPermission} />}
          {activeTab === "users" && <UsersView hasPermission={hasPermission} currentUserId={user.id} />}
          {activeTab === "roles" && <RolesView hasPermission={hasPermission} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
