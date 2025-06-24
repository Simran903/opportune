"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';

// Theme Context
type ThemeClasses = ReturnType<typeof getThemeClasses>;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  getThemeClasses: ThemeClasses;
  getAnimatedBg: () => string[];
  theme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const getThemeClasses = (isDark: boolean) => ({
  background: isDark
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"
    : "bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100",
  card: isDark
    ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80"
    : "bg-white/50 border-white/50 hover:bg-white/80",
  nav: isDark
    ? "bg-slate-800/80 border-slate-700/50"
    : "bg-white/80 border-white/40",
  text: {
    primary: isDark ? "text-white" : "text-slate-900",
    secondary: isDark ? "text-slate-300" : "text-slate-600",
    muted: isDark ? "text-slate-400" : "text-slate-500",
  },
  button: {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white",
    secondary: isDark
      ? "bg-slate-700 hover:bg-slate-600 text-white"
      : "bg-slate-100 hover:bg-slate-200 text-slate-900",
    ghost: isDark
      ? "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
      : "bg-transparent hover:bg-slate/10 text-slate-700 hover:text-slate-900",
  },
  input: isDark
    ? "bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:bg-slate-800/80"
    : "bg-white/50 border-white/50 text-slate-900 placeholder-slate-500 focus:bg-white/80",
  accent: {
    emerald: isDark ? "text-emerald-400" : "text-emerald-600",
    teal: isDark ? "text-teal-400" : "text-teal-600",
    cyan: isDark ? "text-cyan-400" : "text-cyan-600",
  },
  badge: isDark
    ? "bg-emerald-900/50 text-emerald-400"
    : "bg-emerald-100 text-emerald-700",
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setIsDark(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const getAnimatedBg = (): string[] => [
    `absolute -top-10 -right-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl animate-pulse ${isDark
      ? "bg-gradient-to-br from-emerald-600/20 to-teal-600/20"
      : "bg-gradient-to-br from-emerald-400/20 to-teal-400/20"
    }`,
    `absolute top-1/2 -left-10 sm:-left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl animate-pulse delay-1000 ${isDark
      ? "bg-gradient-to-br from-cyan-600/15 to-emerald-600/15"
      : "bg-gradient-to-br from-cyan-400/15 to-emerald-400/15"
    }`,
    `absolute bottom-10 right-1/4 sm:right-1/3 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl animate-pulse delay-2000 ${isDark
      ? "bg-gradient-to-br from-teal-600/20 to-cyan-600/20"
      : "bg-gradient-to-br from-teal-400/20 to-cyan-400/20"
    }`
  ];

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    getThemeClasses: getThemeClasses(isDark),
    getAnimatedBg,
    theme: isDark ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};