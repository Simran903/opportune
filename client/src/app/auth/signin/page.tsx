"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, MapPin, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { GoogleLogin } from '@react-oauth/google';
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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setGoogleLoading(true);
    setError("");
    
    try {
      const res = await axiosClient.post("/user/google", {
        token: credentialResponse.credential,
      });

      const token = res.data?.accesstoken;
      if (token) {
        await TokenManager.storeToken(token);

        SecurityLogger.logSecurityEvent("GOOGLE_LOGIN_SUCCESS", {
          email: res.data?.user?.email,
          timestamp: new Date().toISOString(),
        });

        router.push("/dashboard");
      } else {
        setError("Sign in successful but no token received.");
        SecurityLogger.logSecurityEvent("GOOGLE_LOGIN_NO_TOKEN", {
          email: res.data?.user?.email,
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Google sign in failed. Please try again.";

      setError(errorMessage);

      SecurityLogger.logSecurityEvent("GOOGLE_LOGIN_FAILED", {
        error: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign in was cancelled or failed.");
    setGoogleLoading(false);
    SecurityLogger.logSecurityEvent("GOOGLE_LOGIN_ERROR", {
      error: "User cancelled or error occurred",
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-black" : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"}`}>
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <ThemeToggleButton />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-display font-semibold tracking-tight text-gradient">
                Opportune
              </span>
            </Link>
            <h1 className={`text-4xl sm:text-5xl font-semibold mb-3 ${theme.text.primary}`}>
              Welcome back
            </h1>
            <p className={`text-base sm:text-lg ${theme.text.secondary}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className={`w-full p-8 sm:p-10 rounded-3xl border backdrop-blur-xl shadow-elevated transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-white/10"
              : "bg-white/85 border-slate-200/70"
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className={`block mb-2 font-semibold text-sm ${theme.text.primary} flex items-center space-x-2`}
                  htmlFor="email"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Mail className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    disabled={
                      loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className={`block mb-2 font-semibold text-sm ${theme.text.primary} flex items-center space-x-2`}
                  htmlFor="password"
                >
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Lock className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    disabled={
                      loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? "hover:bg-slate-800 text-slate-400 hover:text-slate-300" 
                        : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    }`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={
                      loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/50 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300 flex-1">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`btn-shine group w-full py-3.5 rounded-xl font-semibold transition-all duration-300 mt-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5 active:scale-[0.98]`}
                disabled={
                  loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? "border-slate-700/50" : "border-slate-300/50"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${theme.text.secondary} bg-inherit font-medium`}>Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="flex justify-center items-center mb-6">
              <div className="w-full flex justify-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme={isDark ? "filled_black" : "outline"}
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                  width="100%"
                />
              </div>
            </div>

            {/* Sign Up Link */}
            <p className={`mt-8 text-center text-sm ${theme.text.secondary} font-medium`}>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className={`font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline-offset-4 hover:underline transition-all duration-200`}
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
