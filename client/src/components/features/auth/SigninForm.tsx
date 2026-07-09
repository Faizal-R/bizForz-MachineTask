import React, { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="••••••••"
            
            className={`${inputClass} pr-12`}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
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
