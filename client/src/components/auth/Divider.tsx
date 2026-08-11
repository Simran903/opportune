"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const Divider = () => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div
          className={`w-full border-t ${isDark ? "border-slate-700/50" : "border-slate-300/50"}`}
        ></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className={`px-4 ${theme.text.secondary} bg-inherit font-medium`}>
          Or continue with
        </span>
      </div>
    </div>
  );
};