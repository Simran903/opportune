"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Save,
  Clock,
  Eye,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import axiosClient from "@/lib/axiosClient";

interface FormData {
  title: string;
  description: string;
  location: string;
  company: string;
}

interface DraftJob extends FormData {
  id: string;
  savedAt: string;
  lastUpdated: string;
  progress: number;
  name?: string;
}

const PostJob = () => {
  const { getThemeClasses, isDark } = useTheme();
  const theme = getThemeClasses;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [drafts, setDrafts] = useState<DraftJob[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");
  const [renameDraftId, setRenameDraftId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const [pendingDraft, setPendingDraft] = useState<DraftJob | null>(null);
  const isDirty = useRef(false);

  const progress = useMemo(() => {
    const fields = [
      formData.title,
      formData.company,
      formData.location,
      formData.description,
    ];
    const filledFields = fields.filter(
      (field) => field.trim().length > 0
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem('jobDrafts') || '[]');
    setDrafts(savedDrafts);
  }, []);

  useEffect(() => {
    isDirty.current = true;
  }, [formData]);

  useEffect(() => {
    const hasContent = Object.values(formData).some(value => value.trim().length > 0);
    if (hasContent && progress > 0 && progress < 100) {
      setAutoSaveStatus("Saving...");
      const timer = setTimeout(() => {
        handleSaveDraft(true, true); // silent, debounced
      }, 2000); // 2s debounce
      return () => clearTimeout(timer);
    }
  }, [formData, progress]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
    setDraftSaved(false);
  };

  const handleSaveDraft = async (isAutoSave = false, isDebounced = false) => {
    if (progress === 0) return;
    if (!isAutoSave) setSavingDraft(true);
    try {
      const draftId = currentDraftId || `draft_${Date.now()}`;
      const now = new Date().toISOString();
      const newDraft: DraftJob = {
        ...formData,
        id: draftId,
        savedAt: !currentDraftId ? now : (drafts.find(d => d.id === draftId)?.savedAt || now),
        lastUpdated: now,
        progress,
        name: drafts.find(d => d.id === draftId)?.name || formData.title || "Untitled Job",
      };
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      updatedDrafts.unshift(newDraft);
      const limitedDrafts = updatedDrafts.slice(0, 10);
      setDrafts(limitedDrafts);
      localStorage.setItem('jobDrafts', JSON.stringify(limitedDrafts));
      setCurrentDraftId(draftId);
      isDirty.current = false;
      if (!isAutoSave) {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 3000);
      }
      if (isDebounced) setAutoSaveStatus("All changes saved");
    } catch (err: any) {
      if (!isAutoSave) setError("Failed to save draft");
      if (isDebounced) setAutoSaveStatus("Failed to auto-save");
    } finally {
      if (!isAutoSave) setSavingDraft(false);
      if (isDebounced) setTimeout(() => setAutoSaveStatus(""), 2000);
    }
  };

  const handleLoadDraft = (draft: DraftJob) => {
    if (isDirty.current && progress > 0 && progress < 100) {
      setPendingDraft(draft);
    } else {
      setFormData({
        title: draft.title,
        description: draft.description,
        location: draft.location,
        company: draft.company,
      });
      setCurrentDraftId(draft.id);
      setShowDrafts(false);
      setError(null);
      setSuccess(false);
      isDirty.current = false;
    }
  };

  const confirmLoadDraft = () => {
    if (pendingDraft) {
      setFormData({
        title: pendingDraft.title,
        description: pendingDraft.description,
        location: pendingDraft.location,
        company: pendingDraft.company,
      });
      setCurrentDraftId(pendingDraft.id);
      setShowDrafts(false);
      setError(null);
      setSuccess(false);
      isDirty.current = false;
      setPendingDraft(null);
    }
  };

  const cancelLoadDraft = () => setPendingDraft(null);

  const handleDeleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem('jobDrafts', JSON.stringify(updatedDrafts));

    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosClient.post('/job/job', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        company: formData.company,
      });

      setSuccess(true);
      setFormData({ title: "", description: "", location: "", company: "" });

      if (currentDraftId) {
        handleDeleteDraft(currentDraftId);
        setCurrentDraftId(null);
      }

      // Optional: Redirect to dashboard or show success message
      console.log('Job posted successfully:', response.data);
    } catch (err: any) {
      console.error("Error posting job:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Common input styles for consistency
  const inputStyles = `w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none shadow-sm ${
    isDark
      ? "bg-slate-800/60 border-slate-700 ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 text-slate-100 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:shadow-lg"
      : "bg-white/90 border-slate-300 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:shadow-lg"
  }`;

  const handleRenameDraft = (draftId: string) => {
    setRenameDraftId(draftId);
    setRenameValue(drafts.find(d => d.id === draftId)?.name || "");
  };

  const saveRenameDraft = (draftId: string) => {
    const updatedDrafts = drafts.map(d => d.id === draftId ? { ...d, name: renameValue } : d);
    setDrafts(updatedDrafts);
    localStorage.setItem('jobDrafts', JSON.stringify(updatedDrafts));
    setRenameDraftId(null);
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary}`}>
                  Post New Job
                </h1>
                <p className={`${theme.text.secondary} mt-1 text-sm sm:text-base`}>
                  Create a job listing to find the perfect candidate
                </p>
              </div>
            </div>

            {/* Draft Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {drafts.length > 0 && (
                <button
                  onClick={() => setShowDrafts(!showDrafts)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 w-full sm:w-auto ${
                    isDark
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Drafts ({drafts.length})
                </button>
              )}
              {progress > 0 && progress < 100 && (
                <button
                  onClick={() => handleSaveDraft()}
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

          {/* Auto-save status */}
          {autoSaveStatus && (
            <div className="mb-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Loader2 className={`w-3 h-3 ${autoSaveStatus === 'Saving...' ? 'animate-spin' : ''}`} />
              {autoSaveStatus}
            </div>
          )}

          {/* Drafts Panel */}
          {showDrafts && (
            <div className={`rounded-xl shadow-lg border backdrop-blur-xl mb-6 w-full max-w-full sm:max-w-lg ${
              isDark 
                ? "bg-slate-900/80 border-slate-800" 
                : "bg-white/80 border-slate-200"
            }`}>
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
                    <div className="flex-1 cursor-pointer" onClick={() => handleLoadDraft(draft)}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {renameDraftId === draft.id ? (
                              <>
                                <input
                                  className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                                  value={renameValue}
                                  onChange={e => setRenameValue(e.target.value)}
                                  onBlur={() => saveRenameDraft(draft.id)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveRenameDraft(draft.id); }}
                                  autoFocus
                                />
                                <button className="ml-1 text-xs text-blue-600" onClick={() => saveRenameDraft(draft.id)}>Save</button>
                              </>
                            ) : (
                              <>
                                {draft.name || draft.title || "Untitled Job"}
                                <button className="ml-2 text-xs text-slate-400 hover:text-blue-600" onClick={e => { e.stopPropagation(); handleRenameDraft(draft.id); }}>Rename</button>
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
                        onClick={() => handleLoadDraft(draft)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Load Draft"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRenameDraft(draft.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                        title="Rename Draft"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
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
          )}

          {pendingDraft && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
              <div className={`rounded-xl p-4 sm:p-6 shadow-xl border backdrop-blur-xl w-full max-w-xs sm:max-w-sm ${
                isDark 
                  ? "bg-slate-900/95 border-slate-800" 
                  : "bg-white/95 border-slate-200"
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme.text.primary}`}>Unsaved Changes</h3>
                <p className={`${theme.text.secondary} mb-4`}>You have unsaved changes. Loading a draft will overwrite your current progress. Do you want to continue?</p>
                <div className="flex gap-4 justify-end">
                  <button className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`} onClick={cancelLoadDraft}>Cancel</button>
                  <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl" onClick={confirmLoadDraft}>Load Draft</button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className={`rounded-xl p-4 mb-6 border backdrop-blur-xl shadow-lg ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme.text.primary}`}>
                Form Progress
              </span>
              <span className={`text-sm font-semibold ${theme.text.primary}`}>
                {progress}%
              </span>
            </div>
            <div className={`w-full rounded-full h-2.5 overflow-hidden ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}>
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className={`mb-6 rounded-xl p-4 border-l-4 border-emerald-500 flex items-start gap-4 shadow-lg backdrop-blur-xl ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className={`text-emerald-600 dark:text-emerald-400 font-semibold mb-1`}>
                Job Posted Successfully!
              </h3>
              <p className={`${theme.text.secondary} text-sm`}>
                Your job is now live and open for applications. Start reviewing potential candidates soon!
              </p>
            </div>
          </div>
        )}

        {draftSaved && (
          <div className={`mb-6 rounded-xl p-4 border-l-4 border-blue-500 flex items-start gap-4 shadow-lg backdrop-blur-xl ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>
            <Save className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className={`text-blue-600 dark:text-blue-400 font-semibold mb-1`}>
                Draft Saved Successfully!
              </h3>
              <p className={`${theme.text.secondary} text-sm`}>
                Your progress has been saved. You can continue editing anytime.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={`mb-6 rounded-xl p-4 border-l-4 border-red-500 flex items-start gap-4 shadow-lg backdrop-blur-xl ${
            isDark 
              ? "bg-slate-900/80 border-slate-800" 
              : "bg-white/80 border-slate-200"
          }`}>
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className={`text-red-600 dark:text-red-400 font-semibold mb-1`}>Error</h3>
              <p className={`${theme.text.secondary} text-sm`}>{error}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className={`rounded-2xl shadow-xl overflow-hidden border backdrop-blur-xl ${
          isDark 
            ? "bg-slate-900/80 border-slate-800" 
            : "bg-white/80 border-slate-200"
        }`}>
          <div className="p-4 sm:p-8">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className={`text-xl font-semibold ${theme.text.primary} mb-6 flex items-center gap-3`}>
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
                      onChange={handleChange}
                      required
                      placeholder="e.g. Senior Software Engineer"
                      className={inputStyles + ' w-full'}
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
                      onChange={handleChange}
                      required
                      placeholder="e.g. TechCorp Inc."
                      className={inputStyles + ' w-full'}
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
                    onChange={handleChange}
                    required
                    placeholder="e.g. New York, NY or Remote"
                    className={inputStyles + ' w-full'}
                  />
                </div>
              </div>

              {/* Job Description Section */}
              <div>
                <h2 className={`text-xl font-semibold ${theme.text.primary} mb-6 flex items-center gap-3`}>
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
                    onChange={handleChange}
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
              <div className={`pt-6 border-t ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full">
                  {progress > 0 && progress < 100 && (
                    <button
                      type="button"
                      onClick={() => handleSaveDraft()}
                      disabled={savingDraft}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
                        isDark
                          ? "bg-slate-700 hover:bg-slate-600 text-white"
                          : "bg-slate-600 hover:bg-slate-700 text-white"
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
                    onClick={handleSubmit}
                    disabled={loading || progress < 100}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:from-slate-600 disabled:to-slate-600 font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-3 min-w-[160px] justify-center w-full sm:w-auto shadow-lg"
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
                    <p className={`text-sm ${theme.text.muted} w-full sm:w-auto text-center sm:text-left`}>
                      Complete all fields to post your job
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;