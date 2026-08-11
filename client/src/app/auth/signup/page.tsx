"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { TokenManager, InputSanitizer, SecurityLogger } from "@/lib/security";
import {
  AuthLayout,
  TextField,
  PasswordToggleButton,
  PasswordStrengthIndicator,
  SubmitButton,
  Divider,
  FormError,
  GoogleAuthButton,
  AuthSwitchLink,
} from "@/components/auth";
import type { PasswordValidation } from "@/components/auth/PasswordStrengthIndicator";
import { useAuthPageInit } from "@/hooks/useAuthPageInit";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation | null>(null);

  useAuthPageInit("signup");
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth("signup", setError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === "email") {
      sanitizedValue = InputSanitizer.sanitizeEmail(value);
    } else if (name === "name") {
      sanitizedValue = InputSanitizer.sanitizeString(value);
    } else {
      sanitizedValue = value; // Don't sanitize password
    }

    setForm({ ...form, [name]: sanitizedValue });
    setError("");

    if (name === "password") {
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

          SecurityLogger.logSecurityEvent("SIGNUP_SUCCESS", {
            email: sanitizedForm.email,
            timestamp: new Date().toISOString(),
          });

          router.push("/dashboard");
        } else {
          setError("Account created successfully but no token received.");
          SecurityLogger.logSecurityEvent("SIGNUP_NO_TOKEN", {
            email: sanitizedForm.email,
          });
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup failed.";
      setError(errorMessage);

      SecurityLogger.logSecurityEvent("SIGNUP_FAILED", {
        email: sanitizedForm.email,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with Opportune today"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Full Name"
          icon={User}
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          placeholder="John Doe"
          disabled={loading}
        />
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
          disabled={loading}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Create a strong password"
          disabled={loading}
          rightElement={
            <PasswordToggleButton
              showPassword={showPassword}
              onToggle={togglePasswordVisibility}
              disabled={loading}
            />
          }
        >
          <PasswordStrengthIndicator
            password={form.password}
            validation={passwordValidation}
          />
        </TextField>

        {error && <FormError message={error} />}

        <SubmitButton
          loading={loading}
          loadingLabel="Creating Account..."
          label="Create Account"
          disabled={!passwordValidation?.isValid}
        />
      </form>

      <Divider />

      <GoogleAuthButton
        mode="signup"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      <AuthSwitchLink
        prompt="Already have an account?"
        label="Sign in"
        href="/auth/signin"
      />
    </AuthLayout>
  );
};

export default SignupPage;