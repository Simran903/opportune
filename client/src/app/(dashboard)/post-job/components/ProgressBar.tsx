"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  return (
    <div
      className={`rounded-2xl p-4 mb-6 border backdrop-blur-xl shadow-soft ${
        isDark ? "bg-white/[0.03] border-white/10" : "bg-white/70 border-slate-200/80"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`eyebrow ${theme.text.muted}`}>Form Progress</span>
        <span className={`text-sm font-mono font-semibold ${theme.accent.emerald}`}>
          {progress}%
        </span>
      </div>
      <div className={`w-full rounded-full h-2.5 overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};