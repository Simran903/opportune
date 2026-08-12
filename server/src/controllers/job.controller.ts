import { z } from "zod";
import prisma from "../config/client";
import axios from "axios";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  company: z.string().min(1, "Company is required"),
});

export const addJob = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const parsedData = jobSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({
          message: "Validation failed",
          errors: parsedData.error.format(),
        });
    }

    const { title, description, location, company } = parsedData.data;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        company,
        user: { connect: { id: userId } },
      },
    });

    axios
      .post(`${process.env.SCRAPE_SERVICE_URL}/scrape`, {
        description,
        employer_id: userId,
        job_id: job.id,
      }, { timeout: 5 * 60 * 1000 })
      .then((response) => {
        const count = response.data?.profiles?.length ?? 0;
        console.log(`Scraper matched ${count} candidates for job ${job.id}`);
      })
      .catch((err) => {
        console.error(
          "Background scraper failed:",
          err?.response?.data || err.message
        );
      });

    return res.status(201).json({
      message: "Job created. Candidates will be matched in the background.",
      job,
    });
  } catch (error) {
    console.error("Error in addJob:", error?.response?.data || error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await prisma.job.findMany({
      where: { userId: userId },
      include: { candidates: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ jobs });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);

    const code = error?.code ?? error?.errorCode;
    if (code === "P2024" || code === "P1001" || error?.name === "PrismaClientInitializationError") {
      return res.status(503).json({
        message: "Database is temporarily unavailable. Please try again shortly.",
      });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getJobById = async (req, res) => {
  const { id } = req.params;

  const jobId = parseInt(id);
  if (isNaN(jobId)) {
    return res.status(400).json({ message: "Invalid job ID." });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        candidates: true,
      },
    });

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const removeJob = async (req, res) => {
  const { id } = req.params;

  const jobId = parseInt(id);
  if (isNaN(jobId)) {
    return res.status(400).json({ message: "Invalid job ID." });
  }

  try {
    const existingJob = await prisma.job.findUnique({ where: { id: jobId } });

    if (!existingJob) {
      return res.status(404).json({ error: "Job not fount." });
    }

    await prisma.job.delete({ where: { id: jobId } });

    return res.status(200).json({ message: "Job removed successfully." });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const normalizeLinkedInUrl = (url: string): string | null => {
  const match = url.match(/linkedin\.com\/in\/([^/?&#]+)/i);
  if (!match?.[1]) return null;
  return `https://www.linkedin.com/in/${match[1].toLowerCase()}`;
};

export const saveProfiles = async (req, res) => {
  const { id } = req.params;
  const { profiles, jobId: requestedJobId } = req.body;

  if (!profiles || !Array.isArray(profiles)) {
    return res.status(400).json({ message: "Profiles must be an array" });
  }

  try {
    const employerId = parseInt(id);
    if (isNaN(employerId)) {
      return res.status(400).json({ message: "Invalid employer ID." });
    }

    let targetJob = null;

    if (requestedJobId) {
      const parsedJobId = parseInt(requestedJobId);
      if (!isNaN(parsedJobId)) {
        targetJob = await prisma.job.findFirst({
          where: { id: parsedJobId, userId: employerId },
        });
      }
    }

    if (!targetJob) {
      targetJob = await prisma.job.findFirst({
        where: { userId: employerId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetJob) {
      return res
        .status(404)
        .json({ message: "No job found for this employer." });
    }

    const uniqueProfiles = new Map<string, string>();
    for (const profile of profiles) {
      const normalized = normalizeLinkedInUrl(profile.profileUrl);
      if (normalized) {
        uniqueProfiles.set(normalized, normalized);
      }
    }

    const result = await prisma.candidate.createMany({
      data: Array.from(uniqueProfiles.values()).map((profileUrl) => ({
        profileUrl,
        jobId: targetJob.id,
      })),
      skipDuplicates: true,
    });

    return res.status(200).json({
      message: "Profiles saved successfully",
      count: result.count,
    });
  } catch (error) {
    console.error("Error saving profiles:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSeenProfiles = async (req, res) => {
  const { id } = req.params;
  const { jobId: requestedJobId } = req.query;

  try {
    const employerId = parseInt(id);
    if (isNaN(employerId)) {
      return res.status(400).json({ message: "Invalid employer ID." });
    }

    const where: {
      job: { userId: number; id?: number };
    } = {
      job: { userId: employerId },
    };

    if (requestedJobId) {
      const parsedJobId = parseInt(requestedJobId as string);
      if (!isNaN(parsedJobId)) {
        where.job.id = parsedJobId;
      }
    }

    const candidates = await prisma.candidate.findMany({
      where,
      select: {
        profileUrl: true,
      },
    });

    const seenProfiles = Array.from(
      new Set(
        candidates
          .map((c) => normalizeLinkedInUrl(c.profileUrl))
          .filter((url): url is string => Boolean(url))
      )
    );

    return res.status(200).json({ seenProfiles });
  } catch (error) {
    console.error("Error fetching seen profiles:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
