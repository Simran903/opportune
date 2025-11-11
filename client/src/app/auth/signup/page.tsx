"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { Eye, EyeOff, AlertCircle, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import {
  TokenManager,
  InputSanitizer,
  SessionManager,
  CSRFProtection,
  SecurityLogger
} from "@/lib/security";

const SignupPage = () => {
  const { getThemeClasses, isDark, getAnimatedBg } = useTheme();
  const theme = getThemeClasses;
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } | null>(null);

  useEffect(() => {
    CSRFProtection.generateCSRFToken();

    SessionManager.startSession();

    SecurityLogger.logSecurityEvent('PAGE_ACCESS', {
      page: 'signup',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === 'email') {
      sanitizedValue = InputSanitizer.sanitizeEmail(value);
    } else if (name === 'name') {
      sanitizedValue = InputSanitizer.sanitizeString(value);
    } else {
      sanitizedValue = value; // Don't sanitize password
    }

    setForm({ ...form, [name]: sanitizedValue });
    setError("");

    if (name === 'password') {
      const validation = InputSanitizer.validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const sanitizedForm = {
      name: InputSanitizer.sanitizeString(form.name),
      email: InputSanitizer.sanitizeEmail(form.email),
      password: form.password, // Don't sanitize password
    };

    if (!sanitizedForm.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    if (!InputSanitizer.validateEmail(sanitizedForm.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!passwordValidation?.isValid) {
      setError("Please fix password requirements.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosClient.post("/user/signup", sanitizedForm);
      if (res.status === 201 || res.status === 200) {
        const token = res.data?.accesstoken;
        if (token) {
          await TokenManager.storeToken(token);

          SecurityLogger.logSecurityEvent('SIGNUP_SUCCESS', {
            email: sanitizedForm.email,
            timestamp: new Date().toISOString(),
          });

          router.push("/dashboard");
        } else {
          setError("Account created successfully but no token received.");
          SecurityLogger.logSecurityEvent('SIGNUP_NO_TOKEN', {
            email: sanitizedForm.email,
          });
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup failed.";
      setError(errorMessage);

      SecurityLogger.logSecurityEvent('SIGNUP_FAILED', {
        email: sanitizedForm.email,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthIndicator = () => {
    if (!form.password) return null;

    const validation = passwordValidation || InputSanitizer.validatePassword(form.password);
    const strengthColors = {
      weak: isDark ? 'bg-red-500' : 'bg-red-500',
      medium: isDark ? 'bg-yellow-500' : 'bg-yellow-500',
      strong: isDark ? 'bg-emerald-500' : 'bg-emerald-500'
    };

    const strengthTextColors = {
      weak: 'text-red-500',
      medium: 'text-yellow-500',
      strong: 'text-emerald-500'
    };

    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center space-x-3">
          <div className={`flex-1 h-2 rounded-full ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strengthColors[validation.strength]}`}
              style={{
                width: `${(validation.strength === 'weak' ? 33 : validation.strength === 'medium' ? 66 : 100)}%`
              }}
            />
          </div>
          <span className={`text-xs font-semibold capitalize ${strengthTextColors[validation.strength]}`}>
            {validation.strength}
          </span>
        </div>

        {/* Password requirements */}
        {validation.errors.length > 0 && (
          <div className="space-y-1.5">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDark ? "text-red-400" : "text-red-500"
                }`} />
                <span className={`leading-tight ${
                  isDark ? "text-red-300" : "text-red-600"
                }`}>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
              Create your account
            </h1>
            <p className={`text-base ${theme.text.secondary}`}>
              Get started with Opportune today
            </p>
          </div>

          {/* Form Card */}
          <div className={`w-full p-8 rounded-2xl border backdrop-blur-xl shadow-xl ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className={`block mb-2 font-medium text-sm ${theme.text.primary}`}
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full"
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </div>
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
                  disabled={loading}
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
                    autoComplete="new-password"
                    required
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {getPasswordStrengthIndicator()}
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
                disabled={loading || !passwordValidation?.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className={`mt-6 text-center text-sm ${theme.text.secondary}`}>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className={`font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
