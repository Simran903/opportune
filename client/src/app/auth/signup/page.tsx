"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
          Sign Up
        </h2>
        <form className="space-y-5">
          <div>
            <label
              className={`block mb-1 font-medium ${theme.text.secondary}`}
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
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none ${theme.input}`}
              autoComplete="name"
            />
          </div>
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
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-4 ${theme.button.primary} shadow-lg hover:shadow-xl`}
            disabled
          >
            Create Account
          </button>
        </form>
        {/* Sign In Link */}
        <p className={`mt-6 text-center text-sm ${theme.text.secondary}`}>
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
}
