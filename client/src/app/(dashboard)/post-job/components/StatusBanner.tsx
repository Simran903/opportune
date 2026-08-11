"use client";

import React from "react";
import { AlertCircle, CheckCircle, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type BannerVariant = "success" | "saved" | "error";

const BANNER_CONFIG: Record<
  BannerVariant,
  { Icon: LucideIcon; accentClass: string; titleClass: string }
> = {
  success: {
    Icon: CheckCircle,
    accentClass: "border-emerald-500 text-emerald-500",
    titleClass: "text-emerald-600 dark:text-emerald-400",
  },
  saved: {
    Icon: Save,
    accentClass: "border-blue-500 text-blue-500",
    titleClass: "text-blue-600 dark:text-blue-400",
  },
  error: {
    Icon: AlertCircle,
    accentClass: "border-red-500 text-red-500",
    titleClass: "text-red-600 dark:text-red-400",
  },
};

interface StatusBannerProps {
  variant: BannerVariant;
  title: string;
  message: string;
}

export const StatusBanner = ({ variant, title, message }: StatusBannerProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;
  const { Icon, accentClass, titleClass } = BANNER_CONFIG[variant];

  return (
    <div
      className={`mb-6 rounded-xl p-4 border-l-4 flex items-start gap-4 shadow-lg backdrop-blur-xl ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${accentClass}`} />
      <div>
        <h3 className={`${titleClass} font-semibold mb-1`}>{title}</h3>
        <p className={`${theme.text.secondary} text-sm`}>{message}</p>
      </div>
    </div>
  );
};