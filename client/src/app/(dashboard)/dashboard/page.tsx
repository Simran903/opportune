"use client";
import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import {
  Loader2,
  AlertCircle,
  Briefcase,
  Search,
  Plus,
  Users,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "./components/JobCard";
import { StatCard } from "./components/StatCard";
import { DeleteJobModal } from "./components/DeleteJobModal";
import { CandidatesModal } from "./components/CandidatesModal";
import { JobDetailsModal } from "./components/JobDetailsModal";
import { parseJobsResponse, jobNeedsCandidates, pageSurface } from "./utils";
import type { Job } from "./types";

const Jobs = () => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceMatching = searchParams.get("matching") === "1";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMatching, setIsMatching] = useState(forceMatching);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [jobDetailsError, setJobDetailsError] = useState<string | null>(null);

  const pollAttempts = useRef(0);

  const fetchJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await axiosClient.get("/job/job");
      const jobsData = parseJobsResponse(response.data);

      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setError(null);

      const hasPendingJobs = jobsData.some(jobNeedsCandidates);
      setIsMatching(hasPendingJobs);

      if (!hasPendingJobs && forceMatching) {
        router.replace("/dashboard", { scroll: false });
      }

      return { jobsData, ok: true as const };
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      const message =
        err.response?.status === 503 || err.response?.status === 500
          ? err.response?.data?.message ||
            "Could not reach the database. Please wait a moment and try again."
          : err.response?.data?.message || "Failed to fetch jobs";

      setError(message);
      if (!isRefresh) {
        setJobs([]);
        setFilteredJobs([]);
      }
      setIsMatching(false);
      return { jobsData: [], ok: false as const };
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [forceMatching, router]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    pollAttempts.current = 0;
    let consecutiveErrors = 0;
    const pollIntervalMs = 15000;
    const maxAttempts = 16;

    const loadAndMaybePoll = async () => {
      const isRefresh = pollAttempts.current > 0;
      const result = await fetchJobs(isRefresh);
      if (cancelled) return;

      if (!result.ok) {
        consecutiveErrors += 1;
        if (consecutiveErrors < 3 && pollAttempts.current < maxAttempts) {
          pollAttempts.current += 1;
          timeoutId = setTimeout(loadAndMaybePoll, pollIntervalMs * 2);
        }
        return;
      }

      consecutiveErrors = 0;
      const { jobsData } = result;
      const hasPendingJobs = jobsData.some(jobNeedsCandidates);

      if (hasPendingJobs && pollAttempts.current < maxAttempts) {
        pollAttempts.current += 1;
        timeoutId = setTimeout(loadAndMaybePoll, pollIntervalMs);
      } else {
        setIsMatching(false);
      }
    };

    loadAndMaybePoll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fetchJobs, forceMatching]);

  // Filter jobs based on search term
  useEffect(() => {
    // Ensure jobs is always an array
    const jobsArray = Array.isArray(jobs) ? jobs : [];
    let filtered = jobsArray;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  const getTotalCandidates = () => {
    return jobs.reduce(
      (total, job) => total + (job.candidates?.length || 0),
      0
    );
  };

  const handleViewCandidates = (job: Job) => {
    setSelectedJob(job);
    setShowCandidatesModal(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    setDeleting(true);
    try {
      await axiosClient.delete(`/job/job/${jobToDelete.id}`);

      // Remove the job from the state
      const updatedJobs = jobs.filter((job) => job.id !== jobToDelete.id);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);

      // Close the modal and reset state
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err: any) {
      console.error("Error deleting job:", err);
      setError(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewJobDetails = async (jobId: number) => {
    setShowJobDetailsModal(true);
    setJobDetails(null);
    setJobDetailsLoading(true);
    setJobDetailsError(null);
    try {
      const response = await axiosClient.get(`/job/job/${jobId}`);
      // Try to get job from response.data, response.data.job, or response.data.data
      const jobData = response.data?.job || response.data?.data || response.data;
      setJobDetails(jobData);
    } catch (err: any) {
      setJobDetailsError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setJobDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin w-6 h-6 text-accent-emerald" />
              <span className={`${theme.text.secondary}`}>Loading jobs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div
            className={`${theme.card} rounded-xl p-6 flex items-center justify-center gap-3`}
          >
            <AlertCircle className="w-6 h-6 text-destructive" />
            <span className={`${theme.text.primary}`}>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-start to-brand-end rounded-2xl shadow-glow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="eyebrow text-accent-emerald mb-1">Dashboard</p>
                <h1
                  className={`text-2xl sm:text-3xl font-semibold ${theme.text.primary}`}
                >
                  Manage Jobs
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => fetchJobs(true)}
                disabled={refreshing}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${theme.button.secondary} disabled:opacity-50`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                className={`btn-shine bg-gradient-to-br from-brand-start to-brand-end text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto`}
                onClick={() => router.push("/post-job")}
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </button>
            </div>
          </div>

          {isMatching && (
            <div className={`mb-6 rounded-2xl p-4 border flex items-center gap-3 bg-accent-emerald/15 border-accent-emerald/30`}>
              <Loader2 className="w-5 h-5 text-accent-emerald animate-spin flex-shrink-0" />
              <div>
                <p className={`text-sm font-semibold ${theme.text.primary}`}>
                  Finding candidates…
                </p>
                <p className={`text-xs ${theme.text.secondary}`}>
                  AI matching runs in the background and can take 1–3 minutes. This page refreshes automatically.
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
            <StatCard
              label="Total Jobs"
              value={jobs.length}
              icon={Briefcase}
              badge="bg-accent-emerald/15"
              iconColor="text-accent-emerald"
            />
            <StatCard
              label="Total Candidates"
              value={getTotalCandidates()}
              icon={Users}
              badge="bg-accent-teal/15"
              iconColor="text-accent-teal"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-2xl p-4 sm:p-5 mb-6 border backdrop-blur-xl shadow-soft ${pageSurface()}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
              <Input
                type="text"
                placeholder="Search jobs by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
<div className={`rounded-2xl p-8 sm:p-12 text-center border backdrop-blur-xl shadow-soft ${pageSurface()}`}>
            <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className={`${theme.text.primary} text-lg font-display font-semibold mb-2`}>
              {jobs.length === 0 ? "No jobs posted yet" : "No jobs found"}
            </h3>
            <p className={`${theme.text.secondary} mb-6`}>
              {jobs.length === 0
                ? "Get started by posting your first job listing"
                : "Try adjusting your search or filter criteria"}
            </p>
            {jobs.length === 0 && (
              <button
                className={`btn-shine bg-gradient-to-br from-brand-start to-brand-end text-white inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:scale-95`}
                onClick={() => router.push("/post-job")}
              >
                <Plus className="w-4 h-4" />
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewCandidates={handleViewCandidates}
                onDelete={handleDeleteJob}
                onViewDetails={handleViewJobDetails}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteJobModal
          open={showDeleteModal}
          job={jobToDelete}
          deleting={deleting}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteJob}
        />

        {/* Candidates Modal */}
        <CandidatesModal
          open={showCandidatesModal}
          job={selectedJob}
          onClose={() => setShowCandidatesModal(false)}
        />

        {/* Job Details Modal */}
        <JobDetailsModal
          open={showJobDetailsModal}
          job={jobDetails}
          loading={jobDetailsLoading}
          error={jobDetailsError}
          onClose={() => setShowJobDetailsModal(false)}
        />
      </div>
    </div>
  );
};

function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-6 h-6 text-accent-emerald" />
        </div>
      }
    >
      <Jobs />
    </Suspense>
  );
}

export default DashboardPage;