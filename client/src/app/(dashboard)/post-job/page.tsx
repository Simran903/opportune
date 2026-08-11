"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { PostJobHeader } from "./components/PostJobHeader";
import { DraftsPanel } from "./components/DraftsPanel";
import { UnsavedChangesModal } from "./components/UnsavedChangesModal";
import { ProgressBar } from "./components/ProgressBar";
import { StatusBanner } from "./components/StatusBanner";
import { JobForm } from "./components/JobForm";
import { EMPTY_FORM } from "./types";
import type { FormData, DraftJob } from "./types";

const PostJob = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

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
    const savedDrafts = JSON.parse(localStorage.getItem("jobDrafts") || "[]");
    setDrafts(savedDrafts);
  }, []);

  useEffect(() => {
    isDirty.current = true;
  }, [formData]);

  useEffect(() => {
    const hasContent = Object.values(formData).some((value) => value.trim().length > 0);
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
        savedAt: !currentDraftId ? now : (drafts.find((d) => d.id === draftId)?.savedAt || now),
        lastUpdated: now,
        progress,
        name: drafts.find((d) => d.id === draftId)?.name || formData.title || "Untitled Job",
      };
      const updatedDrafts = drafts.filter((d) => d.id !== draftId);
      updatedDrafts.unshift(newDraft);
      const limitedDrafts = updatedDrafts.slice(0, 10);
      setDrafts(limitedDrafts);
      localStorage.setItem("jobDrafts", JSON.stringify(limitedDrafts));
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
    const updatedDrafts = drafts.filter((d) => d.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem("jobDrafts", JSON.stringify(updatedDrafts));

    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosClient.post("/job/job", {
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

      router.push("/dashboard?matching=1");
    } catch (err: any) {
      console.error("Error posting job:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameDraft = (draftId: string) => {
    setRenameDraftId(draftId);
    setRenameValue(drafts.find((d) => d.id === draftId)?.name || "");
  };

  const saveRenameDraft = (draftId: string) => {
    const updatedDrafts = drafts.map((d) => (d.id === draftId ? { ...d, name: renameValue } : d));
    setDrafts(updatedDrafts);
    localStorage.setItem("jobDrafts", JSON.stringify(updatedDrafts));
    setRenameDraftId(null);
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <PostJobHeader
          draftsCount={drafts.length}
          showDrafts={showDrafts}
          onToggleDrafts={() => setShowDrafts(!showDrafts)}
          progress={progress}
          savingDraft={savingDraft}
          onSaveDraft={() => handleSaveDraft()}
          autoSaveStatus={autoSaveStatus}
        />

        {showDrafts && (
          <DraftsPanel
            drafts={drafts}
            renameDraftId={renameDraftId}
            renameValue={renameValue}
            onRenameValueChange={setRenameValue}
            onLoad={handleLoadDraft}
            onStartRename={handleRenameDraft}
            onSaveRename={saveRenameDraft}
            onDelete={handleDeleteDraft}
          />
        )}

        {pendingDraft && (
          <UnsavedChangesModal
            onCancel={cancelLoadDraft}
            onConfirm={confirmLoadDraft}
          />
        )}

        <ProgressBar progress={progress} />

        {success && (
          <StatusBanner
            variant="success"
            title="Job Posted Successfully!"
            message="Your job is now live and open for applications. Start reviewing potential candidates soon!"
          />
        )}

        {draftSaved && (
          <StatusBanner
            variant="saved"
            title="Draft Saved Successfully!"
            message="Your progress has been saved. You can continue editing anytime."
          />
        )}

        {error && (
          <StatusBanner variant="error" title="Error" message={error} />
        )}

        <JobForm
          formData={formData}
          onChange={handleChange}
          progress={progress}
          savingDraft={savingDraft}
          onSaveDraft={() => handleSaveDraft()}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PostJob;