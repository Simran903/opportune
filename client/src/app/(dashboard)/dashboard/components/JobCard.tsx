"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Eye,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "../utils";
import type { Job } from "../types";

interface JobCardProps {
  job: Job;
  onViewCandidates: (job: Job) => void;
  onDelete: (job: Job) => void;
  onViewDetails: (jobId: number) => void;
}

export const JobCard = ({
  job,
  onViewCandidates,
  onDelete,
  onViewDetails,
}: JobCardProps) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  return (
    <div
      className={`hover-lift rounded-2xl p-5 sm:p-6 border backdrop-blur-xl group bg-card border-border hover:border-border-accent`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`${theme.text.primary} font-display font-semibold text-lg mb-2 line-clamp-2`}
          >
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className={`${theme.text.secondary} text-sm`}>
              {job.company}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className={`${theme.text.secondary} text-sm`}>
              {job.location}
            </span>
          </div>
        </div>
      </div>

      <p className={`${theme.text.muted} text-sm mb-4 line-clamp-3`}>
        {job.description}
      </p>

      {/* Candidates Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent-teal" />
          <span className={`${theme.text.secondary} text-sm`}>
            {job.candidates?.length || 0} candidate
            {(job.candidates?.length || 0) !== 1 ? "s" : ""}
          </span>
        </div>
        {(job.candidates?.length || 0) > 0 && (
          <button
            onClick={() => onViewCandidates(job)}
            className="text-accent-teal hover:text-accent-teal/80 text-xs font-medium cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className={`${theme.text.muted} text-xs`}>
            Posted {formatDate(job.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-xl bg-accent-emerald/15 text-accent-emerald transition-all duration-200 hover:bg-accent-emerald/25 hover:scale-110 active:scale-95 cursor-pointer"
            onClick={() => onViewDetails(job.id)}
            aria-label="View job details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2.5 rounded-xl bg-destructive/15 text-destructive transition-all duration-200 hover:bg-destructive/25 hover:scale-110 active:scale-95 cursor-pointer"
            onClick={() => onDelete(job)}
            aria-label="Delete job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};