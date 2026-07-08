import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../../components/features/auth/RegisterForm";
import { AuthLeftPanel } from "../../components/features/auth/AuthLeftPanel";
import { useRegister } from "../../hooks/useAuth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { register, loading } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await register(formData);

      if (data?.error || !data?.success) {
        throw new Error(data?.message || "Registration failed. Please try again.");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F7F4] font-sans overflow-hidden">
      {/* Left Panel */}
      <AuthLeftPanel />

      {/* Right Content Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative" style={{ backgroundColor: '#080608' }}>
        {/* Subtle background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-main/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-light/10 rounded-full blur-3xl animate-float"></div>

        <div className="w-full max-w-[460px] text-white rounded-[24px] shadow-2xl p-10 border border-neutral-800 relative z-10" style={{ backgroundColor: '#111111' }}>
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-sm text-gray-400">
              Set up your workspace credentials
            </p>
          </div>

          {error && (
            <div className="bg-red-950/50 text-red-400 p-3.5 rounded-lg text-sm mb-6 border border-red-900/50">
              {error}
            </div>
          )}

          <RegisterForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* Verification Badges */}
          <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-center items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">○ SSL Secured</span>
            <span className="flex items-center gap-1.5">○ 2FA Ready</span>
            <span className="flex items-center gap-1.5">○ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
