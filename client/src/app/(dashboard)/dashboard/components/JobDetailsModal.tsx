"use client";

import React from "react";
import {
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "../utils";
import { CandidateRow } from "./CandidateRow";
import { ModalShell } from "./ModalShell";
import type { Job } from "../types";

interface JobDetailsModalProps {
  open: boolean;
  job: Job | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export const JobDetailsModal = ({
  open,
  job,
  loading,
  error,
  onClose,
}: JobDetailsModalProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  if (!open) return null;

  return (
    <ModalShell className="w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-accent">
        <div>
          <h2 className={`${theme.text.primary} text-xl font-semibold`}>
            Job Details
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-surface-muted`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] scrollbar-hide">
        {loading ? (
          <div className="flex items-center gap-3 justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
            <span className={`${theme.text.secondary}`}>Loading job details...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 justify-center py-8">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className={`${theme.text.primary}`}>{error}</span>
          </div>
        ) : job ? (
          <>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-2`}>
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className={`${theme.text.secondary} text-sm`}>
                {job.company}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className={`${theme.text.secondary} text-sm`}>
                {job.location}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className={`${theme.text.muted} text-xs`}>
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
            <p className={`${theme.text.muted} text-sm mb-4`}>
              {job.description}
            </p>
            <div className="mb-4">
              <h4 className={`${theme.text.primary} font-medium mb-3`}>
                Candidates ({job.candidates?.length || 0})
              </h4>
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
                  <p className={`${theme.text.secondary} font-medium`}>
                    No candidates yet.
                  </p>
                  <p className={`${theme.text.muted} text-sm mt-1`}>
                    Candidates who apply for this job will appear here.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </ModalShell>
  );
};