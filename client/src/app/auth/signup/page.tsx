"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import {
  TokenManager,
  InputSanitizer,
  SessionManager,
  CSRFProtection,
  SecurityLogger
} from "@/lib/security";

const SignupPage = () => {
  const { getThemeClasses } = useTheme();
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
      weak: 'bg-red-500',
      medium: 'bg-yellow-500',
      strong: 'bg-green-500'
    };

    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strengthColors[validation.strength]
                }`}
              style={{
                width: `${(validation.strength === 'weak' ? 33 : validation.strength === 'medium' ? 66 : 100)}%`
              }}
            />
          </div>
          <span className={`text-xs font-medium ${validation.strength === 'weak' ? 'text-red-500' :
              validation.strength === 'medium' ? 'text-yellow-500' : 'text-green-500'
            }`}>
            {validation.strength}
          </span>
        </div>

        {/* Password requirements */}
        {validation.errors.length > 0 && (
          <div className="text-xs space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-1 text-red-500">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="leading-tight">{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
          Sign Up
        </h2>
        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className={`block mb-1 sm:mb-2 font-medium text-sm sm:text-base ${theme.text.secondary}`}
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${theme.input}`}
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${theme.input}`}
              autoComplete="email"
              required
              disabled={loading}
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border text-sm sm:text-base ${theme.input}`}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 ${theme.button.ghost} hover:bg-slate-100 dark:hover:bg-slate-700`}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                )}
              </button>
            </div>
            {getPasswordStrengthIndicator()}
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
            disabled={loading || !passwordValidation?.isValid}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm ${theme.text.secondary}`}>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className={`font-medium underline ${theme.text.primary}`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
