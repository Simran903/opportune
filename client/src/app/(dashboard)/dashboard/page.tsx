"use client";
import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

interface Candidate {
  id: number;
  profileUrl: string;
  createdAt: string;
  jobId: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt: string;
  status: "active" | "inactive" | "draft";
  candidates: Candidate[];
}

const Jobs = () => {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses;
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosClient.get("/job/job");
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        console.log("Response data type:", typeof response.data);
        console.log("Is array:", Array.isArray(response.data));

        // Ensure we're getting an array from the response
        const jobsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.jobs)
            ? response.data.jobs
            : Array.isArray(response.data.data)
              ? response.data.data
              : [];

        console.log("Processed jobs data:", jobsData);
        console.log("Jobs data length:", jobsData.length);

        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err.response?.data?.message || "Failed to fetch jobs");
        setLoading(false);
        // Set empty arrays to prevent filter errors
        setJobs([]);
        setFilteredJobs([]);
      }
    };

    fetchJobs();
  }, []);

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
    const match = profileUrl.match(/\/in\/([^\/]+)\/?$/);
    return match ? match[1] : profileUrl.split("/").pop() || "Unknown";
  };

  const handleViewJobDetails = async (jobId: string) => {
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
    <div className="px-2 sm:px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-bold ${theme.text.primary}`}
                >
                  Manage Jobs
                </h1>
                <p
                  className={`${theme.text.secondary} mt-1 text-sm sm:text-base`}
                >
                  View and manage your job listings
                </p>
              </div>
            </div>
            <button
              className={`${theme.button.primary} flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto`}
              onClick={() => router.push("/post-job")}
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
            <div className={`${theme.card} rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme.text.muted} text-sm`}>Total Jobs</p>
                  <p className={`${theme.text.primary} text-2xl font-bold`}>
                    {jobs.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className={`${theme.card} rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme.text.muted} text-sm`}>
                    Total Candidates
                  </p>
                  <p className={`${theme.text.primary} text-2xl font-bold`}>
                    {getTotalCandidates()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`${theme.card} rounded-xl p-4 sm:p-6 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
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
          <div className={`${theme.card} rounded-xl p-8 sm:p-12 text-center`}>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-2`}>
              {jobs.length === 0 ? "No jobs posted yet" : "No jobs found"}
            </h3>
            <p className={`${theme.text.secondary} mb-6`}>
              {jobs.length === 0
                ? "Get started by posting your first job listing"
                : "Try adjusting your search or filter criteria"}
            </p>
            {jobs.length === 0 && (
              <button
                className={`${theme.button.primary} flex items-center gap-2 px-6 py-3 rounded-lg w-full sm:w-auto`}
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
                className={`${theme.card} rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3
                      className={`${theme.text.primary} font-semibold text-lg mb-2 line-clamp-2`}
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
                      className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-emerald-100 dark:hover:bg-emerald-900/30`}
                      onClick={() => handleViewJobDetails(job.id)}
                    >
                      <Eye className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${theme.button.ghost} hover:bg-red-100 dark:hover:bg-red-900/30`}
                      onClick={() => handleDeleteJob(job)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && jobToDelete && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div
              className={`${theme.card} rounded-xl w-full max-w-xs sm:max-w-md`}
            >
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
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div
              className={`${theme.card} rounded-xl w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden`}
            >
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
                  <div className="space-y-4">
                    {selectedJob.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`${theme.card} border border-slate-200 dark:border-slate-700 rounded-lg p-4`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4
                                className={`${theme.text.primary} font-medium`}
                              >
                                {getLinkedInUsername(candidate.profileUrl)}
                              </h4>
                              <p className={`${theme.text.muted} text-sm`}>
                                {formatDate(candidate.createdAt)}
                              </p>
                            </div>
                          </div>
                          <a
                            href={candidate.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.button.secondary} hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm`}
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
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className={`${theme.card} rounded-xl w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-hidden`}>
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
                      <h4 className={`${theme.text.primary} font-medium mb-2`}>Candidates</h4>
                      {jobDetails.candidates && jobDetails.candidates.length > 0 ? (
                        <div className="space-y-3">
                          {jobDetails.candidates.map((candidate: Candidate) => (
                            <div key={candidate.id} className={`${theme.card} border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between`}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className={`${theme.text.primary} font-medium`}>{getLinkedInUsername(candidate.profileUrl)}</h5>
                                  <p className={`${theme.text.muted} text-xs`}>{formatDate(candidate.createdAt)}</p>
                                </div>
                              </div>
                              <a
                                href={candidate.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-2 py-1 rounded-lg ${theme.button.secondary} hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs`}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Profile
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className={`${theme.text.secondary}`}>No candidates yet.</p>
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

export default Jobs;
