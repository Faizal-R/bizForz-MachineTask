import React, { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  loading: boolean;
}

const inputClass = "w-full px-4 py-3 text-white rounded-lg border border-neutral-800 text-sm outline-none transition-all duration-200 focus:border-[#C8F135]";
const inputStyle = { backgroundColor: "#1a1a1a" };

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onChange,
  formData,
  loading,
}) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const nextStep = () => {
    setLocalError(null);
    if (step === 1) {
      if (!formData.companyName?.trim()) {
        setLocalError("Company name is .");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.adminName?.trim()) {
        setLocalError("Administrator name is .");
        return;
      }
      if (!formData.email?.trim() || !formData.email.includes("@")) {
        setLocalError("Please enter a valid email address.");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    setLocalError(null);
    setStep((prev) => prev - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between mb-4">
        <span style={{ color: "#C8F135" }} className="text-[10px] font-extrabold uppercase tracking-widest">
          Step {step} of 3
        </span>
        <div className="flex gap-1.5">
          <div className={`w-6 h-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#C8F135]" : "bg-neutral-700"}`}></div>
          <div className={`w-6 h-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#C8F135]" : "bg-neutral-700"}`}></div>
          <div className={`w-6 h-1 rounded-full transition-all duration-300 ${step >= 3 ? "bg-[#C8F135]" : "bg-neutral-700"}`}></div>
        </div>
      </div>

      {localError && (
        <div className="p-3 rounded-lg text-xs border text-red-400 border-red-900" style={{ backgroundColor: "#1a0a0a" }}>
          {localError}
        </div>
      )}

      {/* Step 1: Company Name */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Company Name <span style={{ color: "#C8F135" }}>*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
              placeholder="e.g. Acme Corporation"
              
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <button
            type="button"
            onClick={nextStep}
            className="w-full py-3.5 rounded-lg font-black text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200"
            style={{ backgroundColor: "#C8F135", color: "#030047" }}
          >
            <span>Continue</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Step 2: Admin Info */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Administrator Name <span style={{ color: "#C8F135" }}>*</span>
            </label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={onChange}
              placeholder="e.g. John Doe"
              
              className={inputClass}
              style={inputStyle}
            />
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

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={prevStep}
              className="w-1/3 py-3.5 rounded-lg border border-neutral-700 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider cursor-pointer active:scale-[0.97] transition-all duration-200"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="w-2/3 py-3.5 rounded-lg font-black text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200"
              style={{ backgroundColor: "#C8F135", color: "#030047" }}
            >
              <span>Continue</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Password */}
      {step === 3 && (
        <form onSubmit={handleFormSubmit} className="space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Password <span style={{ color: "#C8F135" }}>*</span>
            </label>
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

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Confirm Password <span style={{ color: "#C8F135" }}>*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                
                className={`${inputClass} pr-12`}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
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

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={prevStep}
              className="w-1/3 py-3.5 rounded-lg border border-neutral-700 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider cursor-pointer active:scale-[0.97] transition-all duration-200"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3.5 rounded-lg font-black text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: "#C8F135", color: "#030047" }}
            >
              <span>{loading ? "Registering..." : "Get Started"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* Footer Link */}
      <div className="text-center mt-4 text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/signin" className="text-white hover:text-[#C8F135] font-bold underline transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};
