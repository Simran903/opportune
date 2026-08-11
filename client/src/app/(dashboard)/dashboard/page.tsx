"use client";
import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import {
  Loader2,
  AlertCircle,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Search,
  Plus,
  Eye,
  Trash2,
  Users,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter, useSearchParams } from "next/navigation";

interface Candidate {
  id: number;
  profileUrl: string;
  createdAt: string;
  jobId: number;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt: string;
  status?: "active" | "inactive" | "draft";
  candidates: Candidate[];
}

const parseJobsResponse = (data: unknown): Job[] => {
  if (Array.isArray(data)) return data as Job[];
  if (data && typeof data === "object") {
    const payload = data as { jobs?: Job[]; data?: Job[] };
    if (Array.isArray(payload.jobs)) return payload.jobs;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
};

const jobNeedsCandidates = (job: Job) => {
  const candidateCount = job.candidates?.length ?? 0;
  const createdAt = new Date(job.createdAt).getTime();
  const isRecent = Date.now() - createdAt < 15 * 60 * 1000;
  return candidateCount === 0 && isRecent;
};

const Jobs = () => {
  const { getThemeClasses, isDark } = useTheme();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const getLinkedInUsername = (profileUrl: string) => {
    if (!profileUrl) return "Unknown";
    
    // Remove URL fragments (everything after #)
    const urlWithoutFragment = profileUrl.split('#')[0];
    
    // Try to match LinkedIn profile pattern: /in/username
    const match = urlWithoutFragment.match(/\/in\/([^\/\?]+)/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Fallback: get the last path segment before query params or fragments
    const urlPath = urlWithoutFragment.split('?')[0];
    const segments = urlPath.split('/').filter(seg => seg.length > 0);
    const lastSegment = segments[segments.length - 1];
    
    return lastSegment || "Unknown";
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
              <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
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
            <AlertCircle className="w-6 h-6 text-red-500" />
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-glow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="eyebrow text-emerald-600 dark:text-emerald-400 mb-1">Dashboard</p>
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
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  isDark
                    ? "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                } disabled:opacity-50`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                className={`btn-shine bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-glow hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto`}
                onClick={() => router.push("/post-job")}
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </button>
            </div>
          </div>

          {isMatching && (
            <div className={`mb-6 rounded-2xl p-4 border flex items-center gap-3 ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200"
            }`}>
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0" />
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
            <div className={`hover-lift rounded-2xl p-6 border backdrop-blur-xl ${
              isDark
                ? "bg-white/[0.03] border-white/10"
                : "bg-white/70 border-slate-200/80"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`eyebrow ${theme.text.muted} mb-2`}>Total Jobs</p>
                  <p className={`${theme.text.primary} text-3xl font-display font-semibold`}>
                    {jobs.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/15 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            <div className={`hover-lift rounded-2xl p-6 border backdrop-blur-xl ${
              isDark
                ? "bg-white/[0.03] border-white/10"
                : "bg-white/70 border-slate-200/80"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`eyebrow ${theme.text.muted} mb-2`}>
                    Total Candidates
                  </p>
                  <p className={`${theme.text.primary} text-3xl font-display font-semibold`}>
                    {getTotalCandidates()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-2xl p-4 sm:p-5 mb-6 border backdrop-blur-xl shadow-soft ${
          isDark
            ? "bg-white/[0.03] border-white/10"
            : "bg-white/70 border-slate-200/80"
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`} />
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
          <div className={`rounded-2xl p-8 sm:p-12 text-center border backdrop-blur-xl shadow-soft ${
            isDark
              ? "bg-white/[0.03] border-white/10"
              : "bg-white/70 border-slate-200/80"
          }`}>
            <div className={`w-16 h-16 ${
              isDark ? "bg-white/5" : "bg-slate-100"
            } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Briefcase className="w-8 h-8 text-slate-400" />
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
                className={`btn-shine bg-gradient-to-br from-emerald-500 to-teal-600 text-white inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-glow hover:-translate-y-0.5 active:scale-95`}
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
              <div
                key={job.id}
                className={`hover-lift rounded-2xl p-5 sm:p-6 border backdrop-blur-xl group ${
                  isDark
                    ? "bg-white/[0.03] border-white/10 hover:border-emerald-500/40"
                    : "bg-white/70 border-slate-200/80 hover:border-emerald-300/70"
                }`}
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
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className={`${theme.text.secondary} text-sm`}>
                      {job.candidates?.length || 0} candidate
                      {(job.candidates?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {(job.candidates?.length || 0) > 0 && (
                    <button
                      onClick={() => handleViewCandidates(job)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
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
                      className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20 hover:scale-110 active:scale-95"
                      onClick={() => handleViewJobDetails(job.id)}
                      aria-label="View job details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:scale-110 active:scale-95"
                      onClick={() => handleDeleteJob(job)}
                      aria-label="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && jobToDelete && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="animate-scale-in rounded-2xl w-full max-w-xs sm:max-w-md border border-slate-200 dark:border-teal-500/30 bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-50 backdrop-blur-xl shadow-elevated">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2
                      className={`${theme.text.primary} text-xl font-semibold`}
                    >
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
                    className={`${theme.card} border border-slate-200 dark:border-slate-700 rounded-lg p-3`}
                  >
                    <h4 className={`${theme.text.primary} font-medium`}>
                      {jobToDelete.title}
                    </h4>
                    <p className={`${theme.text.secondary} text-sm`}>
                      {jobToDelete.company} • {jobToDelete.location}
                    </p>
                    {jobToDelete.candidates &&
                      jobToDelete.candidates.length > 0 && (
                        <p className={`${theme.text.muted} text-sm mt-1`}>
                          {jobToDelete.candidates.length} candidate
                          {jobToDelete.candidates.length !== 1 ? "s" : ""} will
                          also be removed
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className={`flex-1 px-4 py-2 rounded-lg ${theme.button.secondary} text-sm font-medium`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteJob}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          </div>
        )}

        {/* Candidates Modal */}
        {showCandidatesModal && selectedJob && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="animate-scale-in rounded-2xl w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden border border-slate-200 dark:border-teal-500/30 bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-50 backdrop-blur-xl shadow-elevated">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className={`${theme.text.primary} text-xl font-semibold`}>
                    Candidates for {selectedJob.title}
                  </h2>
                  <p className={`${theme.text.secondary} text-sm mt-1`}>
                    {selectedJob.candidates?.length || 0} candidate
                    {(selectedJob.candidates?.length || 0) !== 1 ? "s" : ""}{" "}
                    applied
                  </p>
                </div>
                <button
                  onClick={() => setShowCandidatesModal(false)}
                  className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                {selectedJob.candidates && selectedJob.candidates.length > 0 ? (
                  <div className="space-y-2">
                    {selectedJob.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          isDark 
                            ? "bg-slate-800/50" 
                            : "bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                            href={candidate.profileUrl.split('#')[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                              isDark
                                ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Profile
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3
                      className={`${theme.text.primary} text-lg font-semibold mb-2`}
                    >
                      No candidates yet
                    </h3>
                    <p className={`${theme.text.secondary}`}>
                      Candidates who apply for this job will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetailsModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="animate-scale-in rounded-2xl w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden border border-slate-200 dark:border-teal-500/30 bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-50 backdrop-blur-xl shadow-elevated">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className={`${theme.text.primary} text-xl font-semibold`}>Job Details</h2>
                </div>
                <button
                  onClick={() => setShowJobDetailsModal(false)}
                  className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] scrollbar-hide">
                {jobDetailsLoading ? (
                  <div className="flex items-center gap-3 justify-center py-8">
                    <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
                    <span className={`${theme.text.secondary}`}>Loading job details...</span>
                  </div>
                ) : jobDetailsError ? (
                  <div className="flex items-center gap-3 justify-center py-8">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className={`${theme.text.primary}`}>{jobDetailsError}</span>
                  </div>
                ) : jobDetails ? (
                  <>
                    <h3 className={`${theme.text.primary} text-lg font-semibold mb-2`}>{jobDetails.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className={`${theme.text.secondary} text-sm`}>{jobDetails.company}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className={`${theme.text.secondary} text-sm`}>{jobDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className={`${theme.text.muted} text-xs`}>Posted {formatDate(jobDetails.createdAt)}</span>
                    </div>
                    <p className={`${theme.text.muted} text-sm mb-4`}>{jobDetails.description}</p>
                    <div className="mb-4">
                      <h4 className={`${theme.text.primary} font-medium mb-3`}>Candidates ({jobDetails.candidates?.length || 0})</h4>
                      {jobDetails.candidates && jobDetails.candidates.length > 0 ? (
                        <div className="space-y-2">
                          {jobDetails.candidates.map((candidate: Candidate) => (
                            <div key={candidate.id} className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                              isDark 
                                ? "bg-slate-800/50" 
                                : "bg-slate-50/50"
                            }`}>
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className={`${theme.text.primary} font-medium truncate`} title={getLinkedInUsername(candidate.profileUrl)}>
                                      {getLinkedInUsername(candidate.profileUrl)}
                                    </h5>
                                    <p className={`${theme.text.muted} text-xs mt-0.5`}>{formatDate(candidate.createdAt)}</p>
                                  </div>
                                </div>
                                <a
                                  href={candidate.profileUrl.split('#')[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                                    isDark
                                      ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  }`}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Profile
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className={`${theme.text.secondary} font-medium`}>No candidates yet.</p>
                          <p className={`${theme.text.muted} text-sm mt-1`}>Candidates who apply for this job will appear here.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
        </div>
      }
    >
      <Jobs />
    </Suspense>
  );
}

export default DashboardPage;
