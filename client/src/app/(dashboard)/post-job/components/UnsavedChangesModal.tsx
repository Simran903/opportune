"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface UnsavedChangesModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const UnsavedChangesModal = ({
  onCancel,
  onConfirm,
}: UnsavedChangesModalProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-xl p-4 sm:p-6 shadow-elevated border border-border-accent bg-popover text-popover-foreground backdrop-blur-xl w-full max-w-xs sm:max-w-sm">
        <h3 className={`text-lg font-semibold mb-2 ${theme.text.primary}`}>
          Unsaved Changes
        </h3>
        <p className={`${theme.text.secondary} mb-4`}>
          You have unsaved changes. Loading a draft will overwrite your current progress. Do you want to continue?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                : "bg-slate-200 hover:bg-slate-300 text-slate-800"
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={onConfirm}
          >
            Load Draft
          </button>
        </div>
      </div>
    </div>
  );
};