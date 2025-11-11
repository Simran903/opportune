"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import {
  TokenManager,
  InputSanitizer,
  RateLimiter,
  SessionManager,
  CSRFProtection,
  SecurityLogger,
} from "@/lib/security";

const SigninPage = () => {
  const { getThemeClasses, isDark, getAnimatedBg } = useTheme();
  const theme = getThemeClasses;
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    allowed: boolean;
    remainingAttempts: number;
    lockoutTime?: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    CSRFProtection.generateCSRFToken();

    SessionManager.startSession();

    SecurityLogger.logSecurityEvent("PAGE_ACCESS", {
      page: "signin",
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === "email") {
      sanitizedValue = InputSanitizer.sanitizeEmail(value);
    } else {
      sanitizedValue = InputSanitizer.sanitizeString(value);
    }

    setForm({ ...form, [name]: sanitizedValue });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const sanitizedForm = {
      email: InputSanitizer.sanitizeEmail(form.email),
      password: form.password,
    };

    if (!InputSanitizer.validateEmail(sanitizedForm.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const rateLimit = RateLimiter.checkRateLimit(sanitizedForm.email);
    setRateLimitInfo(rateLimit);

    if (!rateLimit.allowed) {
      setError(
        `Too many login attempts. Please try again in ${rateLimit.lockoutTime} seconds.`
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axiosClient.post("/user/signin", sanitizedForm);

      const token = res.data?.accesstoken;
      if (token) {
        await TokenManager.storeToken(token);

        RateLimiter.resetAttempts(sanitizedForm.email);

        SecurityLogger.logSecurityEvent("LOGIN_SUCCESS", {
          email: sanitizedForm.email,
          timestamp: new Date().toISOString(),
        });

        router.push("/dashboard");
      } else {
        setError("Sign in successful but no token received.");
        SecurityLogger.logSecurityEvent("LOGIN_NO_TOKEN", {
          email: sanitizedForm.email,
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Sign in failed. Please try again.";

      setError(errorMessage);

      SecurityLogger.logSecurityEvent("LOGIN_FAILED", {
        email: sanitizedForm.email,
        error: errorMessage,
        remainingAttempts: rateLimit.remainingAttempts,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-slate-950" : "bg-white"}`}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        {/* Grid Pattern */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-20" : "opacity-40"}`}></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggleButton />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${theme.text.primary}`}>
                Opportune
              </span>
            </Link>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${theme.text.primary}`}>
              Welcome back
            </h1>
            <p className={`text-base ${theme.text.secondary}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className={`w-full p-8 rounded-2xl border backdrop-blur-xl shadow-xl ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>

            {/* Rate limit warning */}
            {rateLimitInfo && !rateLimitInfo.allowed && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    Account temporarily locked. Try again in{" "}
                    {rateLimitInfo.lockoutTime} seconds.
                  </span>
                </div>
              </div>
            )}

            {/* Remaining attempts warning */}
            {rateLimitInfo &&
              rateLimitInfo.allowed &&
              rateLimitInfo.remainingAttempts <= 2 &&
              rateLimitInfo.remainingAttempts > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      {rateLimitInfo.remainingAttempts} login attempt
                      {rateLimitInfo.remainingAttempts !== 1 ? "s" : ""} remaining.
                    </span>
                  </div>
                </div>
              )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className={`block mb-2 font-medium text-sm ${theme.text.primary}`}
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full"
                  autoComplete="email"
                  required
                  disabled={
                    loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                  }
                />
              </div>
              <div>
                <label
                  className={`block mb-2 font-medium text-sm ${theme.text.primary}`}
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pr-10"
                    autoComplete="current-password"
                    required
                    disabled={
                      loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors duration-200 ${
                      isDark 
                        ? "hover:bg-slate-800 text-slate-400" 
                        : "hover:bg-slate-100 text-slate-500"
                    }`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={
                      loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={
                  loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className={`mt-6 text-center text-sm ${theme.text.secondary}`}>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className={`font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
