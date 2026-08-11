"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface AuthSwitchLinkProps {
  prompt: string;
  label: string;
  href: string;
}

export const AuthSwitchLink = ({ prompt, label, href }: AuthSwitchLinkProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  return (
    <p className={`mt-8 text-center text-sm ${theme.text.secondary} font-medium`}>
      {prompt}{" "}
      <Link
        href={href}
        className={`font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline-offset-4 hover:underline transition-all duration-200`}
      >
        {label}
      </Link>
    </p>
  );
};