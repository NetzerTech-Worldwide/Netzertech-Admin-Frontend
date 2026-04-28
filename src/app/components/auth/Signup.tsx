import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, School, Users, UserCheck, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";

export const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    schoolName: "",
    role: "",
    schoolSize: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setError(null);
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/school-signup", formData);
      setStep(3); // Success step
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-[1200px] w-full flex bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 min-h-[700px]">
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
              {step === 3 
                ? "Excellent choice for your school." 
                : "Join thousands of schools across the globe."}
            </h1>
            <p className="text-[#A5C9E1] text-lg max-w-md">
              {step === 3 
                ? "You've taken the first step towards a smarter, more efficient educational environment." 
                : "Set up your institution, onboard teachers and students, and manage everything from one powerful dashboard."}
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`} />
            </div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Step {step} of 3</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                  <p className="text-slate-500">Get started managing your school in minutes</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">School Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all"
                        placeholder="school@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#216388] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#1a4f6d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#216388]/20"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                  <p className="text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-[#216388] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">School Information</h2>
                  <p className="text-slate-500">Help us personalize your experience</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">School Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="schoolName"
                        required
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all"
                        placeholder="Netzer International School"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all appearance-none"
                      >
                        <option value="">Select your role</option>
                        <option value="Proprietor/Owner">Proprietor/Owner</option>
                        <option value="Principal/Head Teacher">Principal/Head Teacher</option>
                        <option value="Admin/Bursar">Admin/Bursar</option>
                        <option value="IT Coordinator">IT Coordinator</option>
                        <option value="Teacher">Teacher</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">School Size</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        name="schoolSize"
                        required
                        value={formData.schoolSize}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#216388]/20 focus:border-[#216388] transition-all appearance-none"
                      >
                        <option value="">Select school size</option>
                        <option value="1-100 students">1-100 students</option>
                        <option value="101-500 students">101-500 students</option>
                        <option value="501-1000 students">501-1000 students</option>
                        <option value="1000+ students">1000+ students</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-white text-slate-700 py-4 px-6 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] bg-[#216388] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#1a4f6d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#216388]/20"
                    >
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Complete Set Up
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h2>
                <div className="space-y-4 mb-10">
                  <p className="text-slate-600 text-lg">
                    Thank you for choosing NetzerTech. We have received your school details and account request.
                  </p>
                  <p className="text-[#216388] font-semibold bg-[#216388]/5 py-3 px-6 rounded-2xl border border-[#216388]/10 inline-block">
                    We will reach out to you via email shortly with your login credentials and next steps.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#216388] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#1a4f6d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#216388]/20"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
