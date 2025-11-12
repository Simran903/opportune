"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { Eye, EyeOff, AlertCircle, MapPin, ArrowRight, Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { GoogleLogin } from '@react-oauth/google';
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
  const [googleLoading, setGoogleLoading] = useState(false);

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

        SecurityLogger.logSecurityEvent('GOOGLE_SIGNUP_SUCCESS', {
          email: res.data?.user?.email,
          timestamp: new Date().toISOString(),
        });

        router.push("/dashboard");
      } else {
        setError("Account created successfully but no token received.");
        SecurityLogger.logSecurityEvent('GOOGLE_SIGNUP_NO_TOKEN', {
          email: res.data?.user?.email,
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Google sign up failed. Please try again.";

      setError(errorMessage);

      SecurityLogger.logSecurityEvent('GOOGLE_SIGNUP_FAILED', {
        error: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign up was cancelled or failed.");
    setGoogleLoading(false);
    SecurityLogger.logSecurityEvent('GOOGLE_SIGNUP_ERROR', {
      error: "User cancelled or error occurred",
    });
  };

  const getPasswordStrengthIndicator = () => {
    if (!form.password) return null;

    const validation = passwordValidation || InputSanitizer.validatePassword(form.password);
    const strengthColors = {
      weak: 'bg-red-500',
      medium: 'bg-yellow-500',
      strong: 'bg-emerald-500'
    };

    const strengthTextColors = {
      weak: 'text-red-500 dark:text-red-400',
      medium: 'text-yellow-500 dark:text-yellow-400',
      strong: 'text-emerald-500 dark:text-emerald-400'
    };

    const strengthLabels = {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    };

    return (
      <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center space-x-3">
          <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700/50" : "bg-slate-200"
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${strengthColors[validation.strength]} shadow-sm`}
              style={{
                width: `${(validation.strength === 'weak' ? 33 : validation.strength === 'medium' ? 66 : 100)}%`
              }}
            />
          </div>
          <span className={`text-xs font-bold capitalize px-2 py-1 rounded-md ${
            strengthTextColors[validation.strength]
          } ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            {strengthLabels[validation.strength]}
          </span>
        </div>

        {/* Password requirements */}
        {validation.errors.length > 0 && (
          <div className="space-y-2 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
            <p className={`text-xs font-semibold mb-2 ${isDark ? "text-red-300" : "text-red-700"}`}>
              Password must include:
            </p>
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDark ? "text-red-400" : "text-red-500"
                }`} />
                <span className={`leading-tight text-xs ${
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
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"}`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        {/* Animated Grid Pattern */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-20" : "opacity-30"} animate-pulse`}></div>
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-slate-950/50 via-transparent to-emerald-950/20" : "from-transparent via-emerald-50/20 to-transparent"}`}></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <ThemeToggleButton />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-3xl font-bold bg-gradient-to-r ${isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}>
                  Opportune
                </span>
                <Sparkles className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"} animate-pulse`} />
              </div>
            </Link>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-3 ${theme.text.primary} tracking-tight`}>
              Create your account
            </h1>
            <p className={`text-base sm:text-lg ${theme.text.secondary} font-medium`}>
              Get started with Opportune today
            </p>
          </div>

          {/* Form Card */}
          <div className={`w-full p-8 sm:p-10 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-3xl ${
            isDark 
              ? "bg-slate-900/90 border-slate-800/50 shadow-slate-900/50" 
              : "bg-white/90 border-slate-200/50 shadow-slate-200/50"
          }`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className={`block mb-2 font-semibold text-sm ${theme.text.primary} flex items-center space-x-2`}
                  htmlFor="name"
                >
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <User className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-12"
                    autoComplete="name"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
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
                    disabled={loading}
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
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    required
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {getPasswordStrengthIndicator()}
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/50 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300 flex-1">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 mt-8 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
                disabled={loading || !passwordValidation?.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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

            {/* Google Sign Up Button */}
            <div className="flex justify-center items-center mb-6">
              <div className="w-full flex justify-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme={isDark ? "filled_black" : "outline"}
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  logo_alignment="left"
                  width="100%"
                />
              </div>
            </div>

            <p className={`mt-8 text-center text-sm ${theme.text.secondary} font-medium`}>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className={`font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline-offset-4 hover:underline transition-all duration-200`}
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
