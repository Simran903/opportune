"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { pageSurface } from "../utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  badge: string;
  iconColor: string;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  badge,
  iconColor,
}: StatCardProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className={`hover-lift rounded-2xl p-6 border backdrop-blur-xl ${pageSurface()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`eyebrow ${theme.text.muted} mb-2`}>{label}</p>
          <p className={`${theme.text.primary} text-3xl font-display font-semibold`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${badge} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};