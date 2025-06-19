import express from "express";
import {
  addJob,
  getAllJobs,
  getJobById,
  removeJob,
} from "../controllers/job.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/job", verifyToken as any, addJob);
router.get("/job", verifyToken as any, getAllJobs);
router.get("/job/:id", verifyToken as any, getJobById);
router.delete("/job/:id", verifyToken as any, removeJob);

export default router;