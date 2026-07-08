import React from "react";
import { Link } from "react-router-dom";

interface SigninFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  loading: boolean;
}

const inputClass = "w-full px-4 py-3 text-white rounded-lg border border-neutral-800 text-sm outline-none transition-all duration-200 focus:border-[#C8F135]";
const inputStyle = { backgroundColor: "#1a1a1a" };

export const SigninForm: React.FC<SigninFormProps> = ({
  onSubmit,
  onChange,
  formData,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-left">
      {/* Badge */}
      <div className="flex justify-center mb-1">
        <span
          className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border"
          style={{ backgroundColor: "rgba(200,241,53,0.1)", color: "#C8F135", borderColor: "rgba(200,241,53,0.3)" }}
        >
          Welcome Back!
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Email Address <span style={{ color: "#C8F135" }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="admin@company.com"
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Password <span style={{ color: "#C8F135" }}>*</span>
          </label>
          <Link to="#" className="text-[11px] text-gray-500 hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="••••••••"
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-lg font-black text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
        style={{ backgroundColor: "#C8F135", color: "#030047" }}
      >
        <span>{loading ? "Signing In..." : "Sign in"}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
        </svg>
      </button>

      <div className="text-center mt-4 text-xs text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-white hover:text-[#C8F135] font-bold underline transition-colors">
          Create Workspace
        </Link>
      </div>
    </form>
  );
};
