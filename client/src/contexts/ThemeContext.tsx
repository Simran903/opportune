"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { applyThemeMeta } from "@/lib/themeMeta";

// Theme Context
type ThemeClasses = ReturnType<typeof getThemeClasses>;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  getThemeClasses: ThemeClasses;
  getAnimatedBg: () => string[];
  theme: "dark" | "light";
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
    ? "bg-black"
    : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/40",
  card: "bg-card border-border hover:bg-surface-muted",
  nav: "bg-sidebar border-border",
  text: {
    primary: "text-foreground",
    secondary: "text-secondary-foreground",
    muted: "text-muted-foreground",
  },
  button: {
    primary:
      "bg-gradient-to-br from-brand-start to-brand-end hover:brightness-110 text-white shadow-glow",
    secondary:
      "bg-surface-muted hover:bg-secondary text-secondary-foreground border border-border",
    ghost:
      "bg-transparent hover:bg-surface-muted text-secondary-foreground hover:text-foreground",
  },
  input: "bg-input border-border text-foreground placeholder:text-muted-foreground",
  accent: {
    emerald: "text-accent-emerald",
    teal: "text-accent-teal",
    cyan: "text-accent-cyan",
  },
  badge: isDark
    ? "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30"
    : "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/25",
});

const resolvePreferredTheme = (): boolean => {
  try {
    const savedTheme = localStorage.getItem("opportune-theme");
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    // Use system preference as fallback
    if (window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  } catch (e) {
    console.warn("Failed to read theme preference:", e);
  }

  return true; // Default to dark
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Deterministic default so the server render and the first client render
  // match (avoids hydration mismatch). The real preference is applied on mount.
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDark(resolvePreferredTheme());
  }, []);

  useEffect(() => {
    if (isClient) {
      applyThemeMeta(isDark);
      try {
        localStorage.setItem("opportune-theme", isDark ? "dark" : "light");
      } catch (e) {
        console.warn("Failed to save theme to localStorage:", e);
      }
    }
  }, [isDark, isClient]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const getAnimatedBg = (): string[] => {
    if (!isClient) return [];

    return [
      `absolute -top-24 -right-16 w-72 sm:w-[32rem] h-72 sm:h-[32rem] rounded-full blur-[110px] animate-aurora ${isDark
        ? "bg-gradient-to-br from-emerald-500/25 to-teal-600/20"
        : "bg-gradient-to-br from-emerald-300/40 to-teal-300/30"
      }`,
      `absolute top-1/3 -left-16 sm:-left-24 w-80 sm:w-[36rem] h-80 sm:h-[36rem] rounded-full blur-[120px] animate-aurora [animation-delay:-6s] ${isDark
        ? "bg-gradient-to-br from-cyan-500/18 to-emerald-500/18"
        : "bg-gradient-to-br from-cyan-300/30 to-emerald-300/25"
      }`,
      `absolute -bottom-20 right-1/4 sm:right-1/3 w-64 sm:w-[28rem] h-64 sm:h-[28rem] rounded-full blur-[110px] animate-aurora [animation-delay:-12s] ${isDark
        ? "bg-gradient-to-br from-teal-500/22 to-cyan-600/18"
        : "bg-gradient-to-br from-teal-300/35 to-cyan-300/25"
      }`,
    ];
  };

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    getThemeClasses: getThemeClasses(isDark),
    getAnimatedBg,
    theme: isDark ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
