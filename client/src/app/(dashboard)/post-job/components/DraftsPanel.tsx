"use client";

import React from "react";
import { Eye, FileText, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "../utils";
import type { DraftJob } from "../types";

interface DraftsPanelProps {
  drafts: DraftJob[];
  renameDraftId: string | null;
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  onLoad: (draft: DraftJob) => void;
  onStartRename: (draftId: string) => void;
  onSaveRename: (draftId: string) => void;
  onDelete: (draftId: string) => void;
}

export const DraftsPanel = ({
  drafts,
  renameDraftId,
  renameValue,
  onRenameValueChange,
  onLoad,
  onStartRename,
  onSaveRename,
  onDelete,
}: DraftsPanelProps) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-xl shadow-lg border backdrop-blur-xl mb-6 w-full max-w-full sm:max-w-lg ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Saved Drafts
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Click on a draft to continue editing
        </p>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex-1 cursor-pointer" onClick={() => onLoad(draft)}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {renameDraftId === draft.id ? (
                      <>
                        <input
                          className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                          value={renameValue}
                          onChange={(e) => onRenameValueChange(e.target.value)}
                          onBlur={() => onSaveRename(draft.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onSaveRename(draft.id);
                          }}
                          autoFocus
                        />
                        <button
                          className="ml-1 text-xs text-blue-600"
                          onClick={() => onSaveRename(draft.id)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        {draft.name || draft.title || "Untitled Job"}
                        <button
                          className="ml-2 text-xs text-slate-400 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartRename(draft.id);
                          }}
                        >
                          Rename
                        </button>
                      </>
                    )}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>{draft.company || "No company"}</span>
                    <span>•</span>
                    <span>{draft.progress}% complete</span>
                    <span>•</span>
                    <span>Saved {formatDate(draft.savedAt)}</span>
                    <span>•</span>
                    <span>Updated {formatDate(draft.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoad(draft)}
                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Load Draft"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStartRename(draft.id)}
                className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                title="Rename Draft"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(draft.id)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Draft"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};