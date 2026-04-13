import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Building2, History, AlertCircle, CheckCircle2 } from "lucide-react";
import authApi from "../api/auth.api";
import jobOfferBg from "../assets/job_offer_bg.png";
import Logo from "../components/Logo";

export default function Register({ onBack, onLoginClick, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("job_seeker"); // 'job_seeker' or 'recruiter'

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: role === "job_seeker" ? "job_seeker" : "recruiter",
      };

      const data = await authApi.register(payload);

      console.log("Registration successful:", data);
      
      // store token
      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      setSuccess(true);
      // automatically redirect to login or home after a delay
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(data.data.user);
        } else if (onBack) {
          onBack();
        }
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      // The backend will throw validation errors grouped by field
      const data = err.response?.data;
      if (data?.errors) {
        // Collect all error messages
        const messages = Object.values(data.errors).flat().join(" && ");
        setError(messages);
      } else {
        setError(data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white font-body overflow-hidden">
      {/* Left Panel | Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#00ff41] p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Logo */}
        <div
          className="z-10 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            if (onBack) onBack();
          }}
        >
          <Logo className="text-3xl md:text-4xl pointer-events-none" />
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-start pt-8 lg:pt-12 grow z-10 w-full max-w-lg mx-auto mt-2">
          <h2 className="text-[3.25rem] font-heading font-bold text-center leading-[1.1] mb-6 text-white tracking-tight">
            Your next big<br />career<br />move starts right<br />here.
          </h2>
          <p className="text-white/90 text-center text-[17px] leading-relaxed px-2 font-medium mb-10">
            Join over 2 million professionals finding their dream roles and
            top companies hiring global talent every single day.
          </p>

          {/* Image Container */}
          <div className="w-full max-w-[280px] mb-6 flex justify-center">
            <img
              src={jobOfferBg}
              alt="Job offer background"
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-white/80 text-[13px] font-medium">
          &copy; 2026 Jolly Jobs Ecosystem. All rights reserved.
        </div>
      </div>

      {/* Right Panel | Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative overflow-y-auto">
        <div className="w-full max-w-[480px] space-y-8 my-auto">
          {/* Header */}
          <div>
            <h2 className="text-[2rem] font-heading font-bold text-jolly-navy mb-2 text-left">
              Get started with Jolly Jobs
            </h2>
            <p className="text-text-secondary text-[15px]">
              Create your account to unlock all features.
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                role === "job_seeker"
                  ? "border-jolly-purple bg-jolly-purple/5 text-jolly-purple"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <User className={`w-6 h-6 stroke-[1.5] ${role === "job_seeker" ? "text-jolly-purple" : "text-gray-400"}`} />
              <div className="text-center">
                <div className={`font-semibold text-sm ${role === "job_seeker" ? "text-jolly-navy" : "text-gray-700"}`}>Job Seeker</div>
                <div className="text-[11px] mt-0.5">I'm looking for a job</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                role === "recruiter"
                  ? "border-jolly-purple bg-jolly-purple/5 text-jolly-purple"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <Building2 className={`w-6 h-6 stroke-[1.5] ${role === "recruiter" ? "text-jolly-purple" : "text-gray-400"}`} />
              <div className="text-center">
                <div className={`font-semibold text-sm ${role === "recruiter" ? "text-jolly-navy" : "text-gray-700"}`}>Recruiter</div>
                <div className="text-[11px] mt-0.5">I'm hiring talent</div>
              </div>
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-[13px] text-danger font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p className="text-[13px] text-success font-medium leading-relaxed">Account created successfully! Redirecting...</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="flex gap-4">
              {/* First Name */}
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-jolly-navy block">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-jolly-navy placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all outline-none text-[15px]"
                    placeholder="Hamza"
                    required
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-jolly-navy block">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-jolly-navy placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all outline-none text-[15px]"
                    placeholder="Lafsioui"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-jolly-navy block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-jolly-navy placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all outline-none text-[15px]"
                  placeholder="hamza@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-jolly-navy block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-jolly-navy placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all outline-none text-[15px]"
                  placeholder="*********"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 stroke-[1.5]" />
                  ) : (
                    <Eye className="h-5 w-5 stroke-[1.5]" />
                  )}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password.length > 0 && (
                <div className="pt-1">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded-full ${formData.password.length > 0 ? 'bg-jolly-purple' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 6 ? 'bg-jolly-purple' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-jolly-purple' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 tracking-wider">
                    {formData.password.length >= 8 ? 'PASSWORD STRENGTH: GOOD' : 'PASSWORD STRENGTH: WEAK'}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-jolly-navy block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <History className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-jolly-navy placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all outline-none text-[15px]"
                  placeholder="*********"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start pt-2">
              <input
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-jolly-purple focus:ring-jolly-purple bg-gray-50"
              />
              <label
                htmlFor="terms"
                className="ml-2.5 text-[13px] text-text-secondary cursor-pointer"
              >
                I agree to the <a href="#" className="text-jolly-purple hover:underline">Terms of Service</a> and <a href="#" className="text-jolly-purple hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-jolly-purple hover:bg-jolly-deep-purple text-white font-medium py-3.5 px-4 rounded-button transition-all shadow-sm active:scale-[0.98] text-[15px] mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  Sign Up
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-[14px] text-text-secondary">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onLoginClick) onLoginClick();
              }}
              className="text-jolly-purple font-bold hover:underline transition-all"
            >
              Log In
            </a>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="grow border-t border-gray-100"></div>
            <span className="shrink-0 mx-4 text-gray-400 text-[11px] font-bold tracking-wider">
              OR CONTINUE WITH
            </span>
            <div className="grow border-t border-gray-100"></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-jolly-navy font-semibold py-3 px-4 rounded-button transition-all active:scale-[0.98] text-[13px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-jolly-navy font-semibold py-3 px-4 rounded-button transition-all active:scale-[0.98] text-[13px]"
            >
              <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
