"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { TokenManager, SecurityLogger } from "@/lib/security";

type AuthMode = "signin" | "signup";

const LOG_EVENTS: Record<AuthMode, { success: string; noToken: string; failed: string; error: string }> = {
  signin: {
    success: "GOOGLE_LOGIN_SUCCESS",
    noToken: "GOOGLE_LOGIN_NO_TOKEN",
    failed: "GOOGLE_LOGIN_FAILED",
    error: "GOOGLE_LOGIN_ERROR",
  },
  signup: {
    success: "GOOGLE_SIGNUP_SUCCESS",
    noToken: "GOOGLE_SIGNUP_NO_TOKEN",
    failed: "GOOGLE_SIGNUP_FAILED",
    error: "GOOGLE_SIGNUP_ERROR",
  },
};

const MESSAGES: Record<AuthMode, { noToken: string; failed: string; error: string }> = {
  signin: {
    noToken: "Sign in successful but no token received.",
    failed: "Google sign in failed. Please try again.",
    error: "Google sign in was cancelled or failed.",
  },
  signup: {
    noToken: "Account created successfully but no token received.",
    failed: "Google sign up failed. Please try again.",
    error: "Google sign up was cancelled or failed.",
  },
};

export const useGoogleAuth = (
  mode: AuthMode,
  setError: (message: string) => void
) => {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: any) => {
      setGoogleLoading(true);
      setError("");

      try {
        const res = await axiosClient.post("/user/google", {
          token: credentialResponse.credential,
        });

        const token = res.data?.accesstoken;
        if (token) {
          await TokenManager.storeToken(token);

          SecurityLogger.logSecurityEvent(LOG_EVENTS[mode].success, {
            email: res.data?.user?.email,
            timestamp: new Date().toISOString(),
          });

          router.push("/dashboard");
        } else {
          setError(MESSAGES[mode].noToken);
          SecurityLogger.logSecurityEvent(LOG_EVENTS[mode].noToken, {
            email: res.data?.user?.email,
          });
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          MESSAGES[mode].failed;

        setError(errorMessage);

        SecurityLogger.logSecurityEvent(LOG_EVENTS[mode].failed, {
          error: errorMessage,
        });
      } finally {
        setGoogleLoading(false);
      }
    },
    [mode, router, setError]
  );

  const handleGoogleError = useCallback(() => {
    setError(MESSAGES[mode].error);
    setGoogleLoading(false);
    SecurityLogger.logSecurityEvent(LOG_EVENTS[mode].error, {
      error: "User cancelled or error occurred",
    });
  }, [mode, setError]);

  return { googleLoading, handleGoogleSuccess, handleGoogleError };
};