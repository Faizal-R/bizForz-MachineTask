import React from "react";
import characterImg from "../../../assets/BizforzCharacter-Dmik_TxJ.svg";

export const AuthLeftPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-20 bg-white min-h-screen select-none relative overflow-hidden">
      {/* Decorative background grid and gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-45"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-pale/35 via-transparent to-transparent rounded-full blur-3xl"></div>

      {/* Brand Logo - Name Only */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-secondary-dark flex items-center justify-center shadow-sm">
          <svg
            className="w-5 h-5 text-primary-main"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span className="text-2xl font-black tracking-tight text-[#08060d]">
          Bizforz
        </span>
      </div>

      {/* Hero Content */}
      <div className="my-auto max-w-xl relative z-10 space-y-10">
        <div className="space-y-4">
          <h1 className="text-[52px] font-light text-secondary-dark leading-[1.08] tracking-tight">
            One Platform <br />
            <span className="font-extrabold block mt-2 text-gray-900">
              Every Business Need.
            </span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            CRM, Analytics, Projects, HR — all unified. <br />
            Built for teams that move fast & operate smart.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="w-3 h-3 rounded-full bg-primary-main shadow-[0_0_10px_#C8F135] group-hover:scale-125 transition-transform"></span>
            <span className="text-sm font-bold text-secondary-dark group-hover:translate-x-1 transition-transform">
              CRM — Leads, Contacts & Deals
            </span>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="w-3 h-3 rounded-full bg-secondary-light shadow-[0_0_10px_#3B82F6] group-hover:scale-125 transition-transform"></span>
            <span className="text-sm font-bold text-gray-600 group-hover:translate-x-1 transition-transform">
              Projects — Multi-Tenant Task Boards
            </span>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="w-3 h-3 rounded-full bg-gray-300 group-hover:scale-125 transition-transform"></span>
            <span className="text-sm font-bold text-gray-500 group-hover:translate-x-1 transition-transform">
              HR & Roles — Dynamic Permissions
            </span>
          </div>
        </div>

        {/* Central Illustration using imported Character SVG */}
        <div className="relative w-full h-80 flex items-center justify-center">
          {/* Concentric Wave Rings behind the character */}
          <div className="absolute w-[280px] h-[280px] border border-gray-100 rounded-full animate-pulse"></div>
          <div className="absolute w-[360px] h-[360px] border border-gray-100/70 rounded-full"></div>
          <div className="absolute w-[440px] h-[440px] border border-gray-100/40 rounded-full"></div>

          {/* Real character SVG image */}
          <img
            src={characterImg}
            alt="Workspace Illustration"
            className="w-72 h-72 object-contain z-10 relative"
          />

          {/* Animated Floating Badges */}
          <span className="absolute top-16 right-12 px-4 py-1.5 bg-primary-main border border-primary-dark/10 text-secondary-dark text-xs font-black rounded-full shadow-lg shadow-primary-main/20 animate-float cursor-pointer hover:scale-105 duration-300">
            Analytics
          </span>
          <span className="absolute bottom-16 right-4 px-4 py-1.5 bg-primary-main border border-primary-dark/10 text-secondary-dark text-xs font-black rounded-full shadow-lg shadow-primary-main/20 animate-float-delayed cursor-pointer hover:scale-105 duration-300">
            CRM
          </span>
          <span className="absolute top-28 left-6 px-4 py-1.5 bg-primary-main border border-primary-dark/10 text-secondary-dark text-xs font-black rounded-full shadow-lg shadow-primary-main/20 animate-float cursor-pointer hover:scale-105 duration-300">
            Projects
          </span>
          <span className="absolute bottom-10 left-12 px-4 py-1.5 bg-primary-main border border-primary-dark/10 text-secondary-dark text-xs font-black rounded-full shadow-lg shadow-primary-main/20 animate-float-delayed cursor-pointer hover:scale-105 duration-300">
            HR
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-gray-400 relative z-10 flex justify-between items-center border-t border-gray-100 pt-6">
        <p>Trusted by 100+ Leading brands across India</p>
        <p>© 2026 Bizforz Solutions Pvt Ltd</p>
      </div>
    </div>
  );
};
