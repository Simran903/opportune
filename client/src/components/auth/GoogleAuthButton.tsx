"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "@/contexts/ThemeContext";

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
  onSuccess: (credentialResponse: any) => void;
  onError: () => void;
}

export const GoogleAuthButton = ({
  mode,
  onSuccess,
  onError,
}: GoogleAuthButtonProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex justify-center items-center mb-6">
      <div className="w-full flex justify-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap={false}
          theme={isDark ? "filled_black" : "outline"}
          size="large"
          text={mode === "signin" ? "signin_with" : "signup_with"}
          shape="rectangular"
          logo_alignment="left"
          width="100%"
        />
      </div>
    </div>
  );
};