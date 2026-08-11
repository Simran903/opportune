"use client";

import React from "react";
import { Users, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CandidateRow } from "./CandidateRow";
import { ModalShell } from "./ModalShell";
import type { Job } from "../types";

interface CandidatesModalProps {
  open: boolean;
  job: Job | null;
  onClose: () => void;
}

export const CandidatesModal = ({ open, job, onClose }: CandidatesModalProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  if (!open || !job) return null;

  return (
    <ModalShell className="w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <div>
          <h2 className={`${theme.text.primary} text-xl font-semibold`}>
            Candidates for {job.title}
          </h2>
          <p className={`${theme.text.secondary} text-sm mt-1`}>
            {job.candidates?.length || 0} candidate
            {(job.candidates?.length || 0) !== 1 ? "s" : ""} applied
          </p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-surface-muted`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
        {job.candidates && job.candidates.length > 0 ? (
          <div className="space-y-2">
            {job.candidates.map((candidate) => (
              <CandidateRow key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-2`}>
              No candidates yet
            </h3>
            <p className={`${theme.text.secondary}`}>
              Candidates who apply for this job will appear here.
            </p>
          </div>
        )}
      </div>
    </ModalShell>
  );
};