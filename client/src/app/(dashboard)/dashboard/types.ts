export interface Candidate {
  id: number;
  profileUrl: string;
  createdAt: string;
  jobId: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt: string;
  status?: "active" | "inactive" | "draft";
  candidates: Candidate[];
}