"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ModalShell } from "./ModalShell";
import type { Job } from "../types";

interface DeleteJobModalProps {
  open: boolean;
  job: Job | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteJobModal = ({
  open,
  job,
  deleting,
  onCancel,
  onConfirm,
}: DeleteJobModalProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  if (!open || !job) return null;

  return (
    <ModalShell className="w-full max-w-xs sm:max-w-md">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-destructive/15 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className={`${theme.text.primary} text-xl font-semibold`}>
              Delete Job
            </h2>
            <p className={`${theme.text.secondary} text-sm mt-1`}>
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className={`${theme.text.primary} mb-2`}>
            Are you sure you want to delete this job?
          </p>
          <div
            className={`${theme.card} border border-border rounded-lg p-3`}
          >
            <h4 className={`${theme.text.primary} font-medium`}>
              {job.title}
            </h4>
            <p className={`${theme.text.secondary} text-sm`}>
              {job.company} • {job.location}
            </p>
            {job.candidates && job.candidates.length > 0 && (
              <p className={`${theme.text.muted} text-sm mt-1`}>
                {job.candidates.length} candidate
                {job.candidates.length !== 1 ? "s" : ""} will also be removed
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className={`flex-1 px-4 py-2 rounded-lg ${theme.button.secondary} text-sm font-medium`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Job"
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};