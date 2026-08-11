"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const PasswordToggleButton = ({
  showPassword,
  onToggle,
  disabled = false,
}: PasswordToggleButtonProps) => {
  const { isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
        isDark
          ? "hover:bg-slate-800 text-slate-400 hover:text-slate-300"
          : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
      }`}
      aria-label={showPassword ? "Hide password" : "Show password"}
      disabled={disabled}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );
};