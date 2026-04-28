import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import api from "../../utils/api";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login/admin", { email, password });
      localStorage.setItem("admin_token", response.accessToken);
      // If user info is available, store it or handle it as needed
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-[1200px] w-full flex bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50">
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#216388] p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-[#216388] rounded-md rotate-12" />
              </div>
              <span className="text-white text-2xl font-bold tracking-tight">NetzerTech</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Manage your school <br />with confidence.
            </h1>
            <p className="text-[#A5C9E1] text-lg max-w-md">
              The all-in-one platform for school administrators to manage students, teachers, finance, and more.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <p className="text-white text-sm italic mb-4">
                "NetzerTech has completely transformed how we handle our school's daily operations. Efficiency is at an all-time high."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300" />
                <div>
                  <p className="text-white font-semibold text-sm">Sarah Jenkins</p>
                  <p className="text-[#A5C9E1] text-xs">Admin, Westview Academy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Sign in to your administrator portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all"
                    placeholder="admin@school.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-sm font-medium text-[#216388] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#216388] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#1a4f6d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#216388]/20"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-500">
                Don't have a school account?{" "}
                <Link to="/signup" className="font-bold text-[#216388] hover:underline">
                  Sign up your school
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
