"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import {
  TokenManager,
  InputSanitizer,
  RateLimiter,
  SessionManager,
  CSRFProtection,
  SecurityLogger,
} from "@/lib/security";

const SigninPage = () => {
  const { getThemeClasses } = useTheme();
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
      password: form.password, // Don't sanitize password as it might contain special chars
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
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${theme.background}`}
    >
      <div
        className={`w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border ${theme.card}`}
      >
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center ${theme.text.primary}`}
        >
          Sign In
        </h2>

        {/* Rate limit warning */}
        {rateLimitInfo && !rateLimitInfo.allowed && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-700 dark:text-red-300">
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
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                  {rateLimitInfo.remainingAttempts} login attempt
                  {rateLimitInfo.remainingAttempts !== 1 ? "s" : ""} remaining.
                </span>
              </div>
            </div>
          )}

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className={`block mb-1 sm:mb-2 font-medium text-sm sm:text-base ${theme.text.secondary}`}
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-300 focus:outline-none text-sm sm:text-base ${theme.input}`}
              autoComplete="email"
              required
              disabled={
                loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
              }
            />
          </div>
          <div>
            <label
              className={`block mb-1 sm:mb-2 font-medium text-sm sm:text-base ${theme.text.secondary}`}
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border transition-all duration-300 focus:outline-none text-sm sm:text-base ${theme.input}`}
                autoComplete="current-password"
                required
                disabled={
                  loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 ${theme.button.ghost} hover:bg-slate-100 dark:hover:bg-slate-700`}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={
                  loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs sm:text-sm text-center font-medium pt-1 flex items-center justify-center space-x-2">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 mt-4 text-sm sm:text-base ${theme.button.primary} shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
            disabled={
              loading || (rateLimitInfo ? !rateLimitInfo.allowed : false)
            }
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p
          className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm ${theme.text.secondary}`}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className={`font-medium underline ${theme.text.primary}`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
