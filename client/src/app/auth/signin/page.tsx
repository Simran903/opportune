"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";

const SigninPage = () => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        <form className="space-y-5">
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
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none ${theme.input}`}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-4 ${theme.button.primary} shadow-lg hover:shadow-xl`}
            disabled
          >
            Sign In
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
