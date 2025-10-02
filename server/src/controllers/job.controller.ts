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
      .post("http://localhost:10000/scrape", {
        description,
        employer_id: userId,
      })
      .then(async (response) => {
        const candidates = response.data.profiles || [];

        for (const candidate of candidates) {
          await prisma.candidate.create({
            data: {
              profileUrl: candidate.profileUrl,
              job: { connect: { id: job.id } },
            },
          });
        }
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
  } catch (error) {
    console.error("Error fetching job:", error);
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

export const saveProfiles = async (req, res) => {
  const { id } = req.params;
  const { profiles } = req.body;

  if (!profiles || !Array.isArray(profiles)) {
    return res.status(400).json({ message: "Profiles must be an array" });
  }

  try {
    const employerId = parseInt(id);
    if (isNaN(employerId)) {
      return res.status(400).json({ message: "Invalid employer ID." });
    }

    const latestJob = await prisma.job.findFirst({
      where: { userId: employerId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestJob) {
      return res
        .status(404)
        .json({ message: "No job found for this employer." });
    }

    const result = await prisma.candidate.createMany({
      data: profiles.map((profile) => ({
        profileUrl: profile.profileUrl,
        jobId: latestJob.id,
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

  try {
    const employerId = parseInt(id);
    if (isNaN(employerId)) {
      return res.status(400).json({ message: "Invalid employer ID." });
    }

    const candidates = await prisma.candidate.findMany({
      where: {
        job: {
          userId: employerId,
        },
      },
      select: {
        profileUrl: true,
      },
    });

    const seenProfiles = candidates.map((c) => c.profileUrl);

    return res.status(200).json({ seenProfiles });
  } catch (error) {
    console.error("Error fetching seen profiles:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
