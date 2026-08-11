"use client";

import React from "react";
import { Briefcase, FileText, Loader2, Plus, Save } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { FormData } from "../types";

interface JobFormProps {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  progress: number;
  savingDraft: boolean;
  onSaveDraft: () => void;
  loading: boolean;
  onSubmit: () => void;
}

export const JobForm = ({
  formData,
  onChange,
  progress,
  savingDraft,
  onSaveDraft,
  loading,
  onSubmit,
}: JobFormProps) => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;

  const inputStyles = `w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none backdrop-blur-sm shadow-soft ${
    isDark
      ? "bg-white/[0.03] border-white/10 placeholder:text-slate-500 text-slate-100 hover:border-white/20 focus-visible:border-emerald-400/60 focus-visible:ring-4 focus-visible:ring-emerald-500/15"
      : "bg-white/80 border-slate-200 placeholder:text-slate-400 text-slate-900 hover:border-slate-300 focus-visible:border-emerald-500/70 focus-visible:ring-4 focus-visible:ring-emerald-500/15"
  }`;

  return (
    <div
      className={`rounded-3xl shadow-soft overflow-hidden border backdrop-blur-xl ${
        isDark ? "bg-white/[0.03] border-white/10" : "bg-white/70 border-slate-200/80"
      }`}
    >
      <div className="p-4 sm:p-8">
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2
              className={`text-xl font-semibold ${theme.text.primary} mb-6 flex items-center gap-3`}
            >
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  placeholder="e.g. Senior Software Engineer"
                  className={inputStyles + " w-full"}
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={onChange}
                  required
                  placeholder="e.g. TechCorp Inc."
                  className={inputStyles + " w-full"}
                />
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 space-y-2">
              <label className={`text-sm font-medium ${theme.text.primary}`}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                required
                placeholder="e.g. New York, NY or Remote"
                className={inputStyles + " w-full"}
              />
            </div>
          </div>

          {/* Job Description Section */}
          <div>
            <h2
              className={`text-xl font-semibold ${theme.text.primary} mb-6 flex items-center gap-3`}
            >
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              Job Description
            </h2>

            <div className="space-y-3">
              <label className={`text-sm font-medium ${theme.text.primary}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                rows={6}
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                className={`${inputStyles} resize-none w-full`}
              />
              <p className={`${theme.text.muted} text-sm flex items-center gap-2`}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Include key responsibilities, required skills, and company culture
              </p>
            </div>
          </div>

          {/* Submit Section */}
          <div className={`pt-6 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full">
              {progress > 0 && progress < 100 && (
                <button
                  type="button"
                  onClick={onSaveDraft}
                  disabled={savingDraft}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
                    isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-600 hover:bg-slate-700 text-white"
                  }`}
                >
                  {savingDraft ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save as Draft
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onSubmit}
                disabled={loading || progress < 100}
                className="btn-shine bg-gradient-to-br from-emerald-500 to-teal-600 text-white disabled:from-slate-500 disabled:to-slate-500 disabled:shadow-none font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-3 min-w-[160px] justify-center w-full sm:w-auto shadow-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Post Job</span>
                  </>
                )}
              </button>
              {progress < 100 && !loading && (
                <p
                  className={`text-sm ${theme.text.muted} w-full sm:w-auto text-center sm:text-left`}
                >
                  Complete all fields to post your job
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};