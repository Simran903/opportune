"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const SigninPage = () => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/user/signin", {
        email: form.email,
        password: form.password,
      });

      const token = res.data?.accesstoken;
      if (token) {
        localStorage.setItem("accessToken", token);
        router.push("/dashboard");
      } else {
        setError("Sign in successful but no token received.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Sign in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme.background}`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl border ${theme.card}`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${theme.text.primary}`}
        >
          Sign In
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className={`block mb-1 font-medium ${theme.text.secondary}`}
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
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none ${theme.input}`}
              autoComplete="email"
            />
          </div>
          <div>
            <label
              className={`block mb-1 font-medium ${theme.text.secondary}`}
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
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none ${theme.input}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 ${theme.button.ghost} hover:bg-slate-100 dark:hover:bg-slate-700`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-500" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center font-medium pt-1">
              {error}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-4 ${theme.button.primary} shadow-lg hover:shadow-xl flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className={`mt-6 text-center text-sm ${theme.text.secondary}`}>
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
