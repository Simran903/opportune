"use client";
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { TokenManager, InputSanitizer, RateLimiter, SecurityLogger } from "@/lib/security";
import {
  AuthLayout,
  TextField,
  PasswordToggleButton,
  SubmitButton,
  Divider,
  FormError,
  GoogleAuthButton,
  AuthSwitchLink,
  RateLimitWarning,
} from "@/components/auth";
import type { RateLimitInfo } from "@/components/auth/RateLimitWarning";
import { useAuthPageInit } from "@/hooks/useAuthPageInit";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const SigninPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);

  useAuthPageInit("signin");
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth("signin", setError);

  const isLockedOut = rateLimitInfo ? !rateLimitInfo.allowed : false;

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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      titleClassName="text-4xl sm:text-5xl"
    >
      <RateLimitWarning rateLimitInfo={rateLimitInfo} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          label="Email"
          icon={Mail}
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="you@example.com"
          disabled={loading || isLockedOut}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          placeholder="Enter your password"
          disabled={loading || isLockedOut}
          rightElement={
            <PasswordToggleButton
              showPassword={showPassword}
              onToggle={togglePasswordVisibility}
              disabled={loading || isLockedOut}
            />
          }
        />

        {error && <FormError message={error} />}

        <SubmitButton
          loading={loading}
          loadingLabel="Signing In..."
          label="Sign In"
          disabled={isLockedOut}
        />
      </form>

      <Divider />

      <GoogleAuthButton
        mode="signin"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      <AuthSwitchLink
        prompt="Don't have an account?"
        label="Sign up"
        href="/auth/signup"
      />
    </AuthLayout>
  );
};

export default SigninPage;