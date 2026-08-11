"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete: string;
  disabled?: boolean;
  required?: boolean;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
}

export const TextField = ({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled = false,
  required = true,
  rightElement,
  children,
}: TextFieldProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className="space-y-2">
      <label
        className={`block mb-2 font-semibold text-sm ${theme.text.primary} flex items-center space-x-2`}
        htmlFor={id}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Icon className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        </div>
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 ${rightElement ? "pr-12" : ""}`}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        {rightElement}
      </div>
      {children}
    </div>
  );
};