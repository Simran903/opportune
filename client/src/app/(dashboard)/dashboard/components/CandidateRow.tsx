"use client";

import React from "react";
import { Users, ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate, getLinkedInUsername } from "../utils";
import type { Candidate } from "../types";

export const CandidateRow = ({ candidate }: { candidate: Candidate }) => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;

  return (
    <div className="border border-border bg-surface-muted rounded-lg p-4 transition-colors hover:bg-muted/60">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-accent-teal/15 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-accent-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`${theme.text.primary} font-medium truncate`}
              title={getLinkedInUsername(candidate.profileUrl)}
            >
              {getLinkedInUsername(candidate.profileUrl)}
            </h4>
            <p className={`${theme.text.muted} text-xs mt-0.5`}>
              {formatDate(candidate.createdAt)}
            </p>
          </div>
        </div>
        <a
          href={candidate.profileUrl.split("#")[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 bg-gradient-to-br from-brand-start to-brand-end hover:brightness-110 text-white shadow-glow hover:-translate-y-0.5 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
          View Profile
        </a>
      </div>
    </div>
  );
};