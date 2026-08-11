"use client";

import React from "react";
import { Clock, Loader2, Plus, Save } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PostJobHeaderProps {
  draftsCount: number;
  showDrafts: boolean;
  onToggleDrafts: () => void;
  progress: number;
  savingDraft: boolean;
  onSaveDraft: () => void;
  autoSaveStatus: string;
}

export const PostJobHeader = ({
  draftsCount,
  showDrafts,
  onToggleDrafts,
  progress,
  savingDraft,
  onSaveDraft,
  autoSaveStatus,
}: PostJobHeaderProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-start to-brand-end rounded-2xl shadow-glow">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="eyebrow text-accent-emerald mb-1">Create Listing</p>
            <h1 className={`text-2xl sm:text-3xl font-semibold ${theme.text.primary}`}>
              Post New Job
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {draftsCount > 0 && (
            <button
              onClick={onToggleDrafts}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 w-full sm:w-auto ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              Drafts ({draftsCount})
            </button>
          )}
          {progress > 0 && progress < 100 && (
            <button
              onClick={onSaveDraft}
              disabled={savingDraft}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              {savingDraft ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Draft
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {autoSaveStatus && (
        <div className="mb-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Loader2 className={`w-3 h-3 ${autoSaveStatus === "Saving..." ? "animate-spin" : ""}`} />
          {autoSaveStatus}
        </div>
      )}
    </div>
  );
};