"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient"; // adjust path if needed

const SignupPage = () => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/user/signup", form);
      if (res.status === 201 || res.status === 200) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed.");
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
          Sign Up
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
              className={`w-full px-4 py-3 rounded-xl border ${theme.input}`}
              autoComplete="name"
              required
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
              className={`w-full px-4 py-3 rounded-xl border ${theme.input}`}
              autoComplete="email"
              required
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
              className={`w-full px-4 py-3 rounded-xl border ${theme.input}`}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-4 ${theme.button.primary} shadow-lg hover:shadow-xl`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

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
};

export default SignupPage;
