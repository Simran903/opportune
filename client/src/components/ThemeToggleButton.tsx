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
      className={`group relative p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden ${isDark
        ? "bg-white/5 hover:bg-white/10 text-amber-300"
        : "bg-white/80 hover:bg-white text-slate-700"
        } backdrop-blur-md border ${isDark ? "border-white/10" : "border-slate-200/80"
        } shadow-soft ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-br transition-opacity duration-300 ${isDark
          ? "from-amber-400/20 to-orange-500/10"
          : "from-emerald-400/15 to-teal-500/10"
          } opacity-0 group-hover:opacity-100`}
      />
      <span className="relative block transition-transform duration-500 group-hover:rotate-[18deg]">
        {isDark ? (
          <Sun className="w-5 h-5" strokeWidth={2} />
        ) : (
          <Moon className="w-5 h-5" strokeWidth={2} />
        )}
      </span>
    </button>
  );
};