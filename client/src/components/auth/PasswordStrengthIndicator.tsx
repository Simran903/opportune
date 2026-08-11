"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InputSanitizer } from "@/lib/security";

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

interface PasswordStrengthIndicatorProps {
  password: string;
  validation: PasswordValidation | null;
}

const STRENGTH_COLORS: Record<PasswordValidation["strength"], string> = {
  weak: "bg-red-500",
  medium: "bg-yellow-500",
  strong: "bg-emerald-500",
};

const STRENGTH_TEXT_COLORS: Record<PasswordValidation["strength"], string> = {
  weak: "text-red-500 dark:text-red-400",
  medium: "text-yellow-500 dark:text-yellow-400",
  strong: "text-emerald-500 dark:text-emerald-400",
};

const STRENGTH_LABELS: Record<PasswordValidation["strength"], string> = {
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

export const PasswordStrengthIndicator = ({
  password,
  validation,
}: PasswordStrengthIndicatorProps) => {
  const { isDark } = useTheme();

  if (!password) return null;

  const resolved = validation || InputSanitizer.validatePassword(password);

  return (
    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center space-x-3">
        <div
          className={`flex-1 h-2.5 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700/50" : "bg-slate-200"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${STRENGTH_COLORS[resolved.strength]} shadow-sm`}
            style={{
              width: `${
                resolved.strength === "weak"
                  ? 33
                  : resolved.strength === "medium"
                    ? 66
                    : 100
              }%`,
            }}
          />
        </div>
        <span
          className={`text-xs font-bold capitalize px-2 py-1 rounded-md ${
            STRENGTH_TEXT_COLORS[resolved.strength]
          } ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
        >
          {STRENGTH_LABELS[resolved.strength]}
        </span>
      </div>

      {/* Password requirements */}
      {resolved.errors.length > 0 && (
        <div className="space-y-2 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
          <p
            className={`text-xs font-semibold mb-2 ${isDark ? "text-red-300" : "text-red-700"}`}
          >
            Password must include:
          </p>
          {resolved.errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 text-sm animate-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AlertCircle
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDark ? "text-red-400" : "text-red-500"
                }`}
              />
              <span
                className={`leading-tight text-xs ${
                  isDark ? "text-red-300" : "text-red-600"
                }`}
              >
                {error}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};