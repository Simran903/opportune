import { z } from "zod";
import prisma from "../config/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
      return res.status(400).json({ message: "Validation failed", errors: parsedData.error.format() });
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

    const command = `echo "${description}" | ./python/run_scraper.sh`;
    const { stdout } = await execAsync(command, { maxBuffer: 1024 * 1000 });

    const candidates = JSON.parse(stdout);

    for (const candidate of candidates) {
      await prisma.candidate.create({
        data: {
          profileUrl: candidate.profileUrl,
          job: { connect: { id: job.id } },
        },
      });
    }

    return res.status(201).json({
      message: "Job created and candidates matched successfully",
      job,
      candidates,
    });
  } catch (error) {
    console.error("Error in addJob:", error);
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
