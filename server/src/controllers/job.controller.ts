import { z } from "zod";
import prisma from "../config/client";
import axios from "axios";
import { Request, Response } from 'express';

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  company: z.string().min(1, "Company is required"),
});

export const addJob = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const parsedData = jobSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed", errors: parsedData.error.format() });
      return;
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

    axios.post("http://localhost:10000/scrape", {
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

        console.log("Background scraping and candidate saving completed.");
      })
      .catch((err: any) => {
        console.error("Background scraper failed:", err?.response?.data || err.message);
      });

    res.status(201).json({
      message: "Job created. Candidates will be matched in the background.",
      job,
    });
  } catch (error: any) {
    console.error("Error in addJob:", error?.response?.data || error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const jobs = await prisma.job.findMany({
      where: { userId: userId },
      include: { candidates: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ jobs });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const jobId = parseInt(id);
  if (isNaN(jobId)) {
    res.status(400).json({ message: "Invalid job ID." });
    return;
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

    res.status(200).json({ job });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const removeJob = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const jobId = parseInt(id);
  if (isNaN(jobId)) {
    res.status(400).json({ message: "Invalid job ID." });
    return;
  }

  try {
    const existingJob = await prisma.job.findUnique({ where: { id: jobId } });

    if (!existingJob) {
      res.status(404).json({ error: "Job not found." });
      return;
    }

    await prisma.job.delete({ where: { id: jobId } });

    res.status(200).json({ message: "Job removed successfully." });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};