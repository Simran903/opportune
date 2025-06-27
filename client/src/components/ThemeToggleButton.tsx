import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import React, { FC } from 'react';

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDark
        ? "bg-slate-800/80 hover:bg-slate-700/80 text-yellow-400"
        : "bg-white/80 hover:bg-white text-slate-800"
        } backdrop-blur-sm border ${isDark ? "border-slate-700/50" : "border-white/50"
        } shadow-lg ${className}`}
      title="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5" strokeWidth={2} />
      )}
    </button>
  );
};