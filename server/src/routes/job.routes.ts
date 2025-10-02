import express from "express";
import {
  addJob,
  getAllJobs,
  getJobById,
  getSeenProfiles,
  removeJob,
  saveProfiles,
} from "../controllers/job.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/job", verifyToken as any, addJob);
router.get("/job", verifyToken as any, getAllJobs);
router.get("/job/:id", verifyToken as any, getJobById);
router.delete("/job/:id", verifyToken as any, removeJob);
router.post('/employer/:id/profiles', saveProfiles);
router.get('/employer/:id/seen-profiles', getSeenProfiles);

export default router;