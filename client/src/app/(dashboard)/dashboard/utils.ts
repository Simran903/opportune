import type { Job } from "./types";

export const pageSurface = () => "bg-card border-border";

export const parseJobsResponse = (data: unknown): Job[] => {
  if (Array.isArray(data)) return data as Job[];
  if (data && typeof data === "object") {
    const payload = data as { jobs?: Job[]; data?: Job[] };
    if (Array.isArray(payload.jobs)) return payload.jobs;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
};

export const jobNeedsCandidates = (job: Job) => {
  const candidateCount = job.candidates?.length ?? 0;
  const createdAt = new Date(job.createdAt).getTime();
  const isRecent = Date.now() - createdAt < 15 * 60 * 1000;
  return candidateCount === 0 && isRecent;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getLinkedInUsername = (profileUrl: string) => {
  if (!profileUrl) return "Unknown";

  // Remove URL fragments (everything after #)
  const urlWithoutFragment = profileUrl.split("#")[0];

  // Try to match LinkedIn profile pattern: /in/username
  const match = urlWithoutFragment.match(/\/in\/([^\/\?]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback: get the last path segment before query params or fragments
  const urlPath = urlWithoutFragment.split("?")[0];
  const segments = urlPath.split("/").filter((seg) => seg.length > 0);
  const lastSegment = segments[segments.length - 1];

  return lastSegment || "Unknown";
};