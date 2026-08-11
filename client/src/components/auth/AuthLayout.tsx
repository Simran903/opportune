"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  titleClassName?: string;
  children: React.ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  titleClassName = "text-3xl sm:text-4xl whitespace-nowrap",
  children,
}: AuthLayoutProps) => {
  const { getThemeClasses, isDark, getAnimatedBg } = useTheme();
  const theme = getThemeClasses;

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isDark ? "bg-black" : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
      }`}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <ThemeToggleButton />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-display font-semibold tracking-tight text-gradient">
                Opportune
              </span>
            </Link>
            <h1
              className={`${titleClassName} font-semibold mb-3 ${theme.text.primary}`}
            >
              {title}
            </h1>
            <p className={`text-base sm:text-lg ${theme.text.secondary}`}>
              {subtitle}
            </p>
          </div>

          <div
            className={`w-full p-8 sm:p-10 rounded-3xl border backdrop-blur-xl shadow-elevated transition-all duration-300 ${
              isDark
                ? "bg-slate-900/80 border-white/10"
                : "bg-white/85 border-slate-200/70"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};