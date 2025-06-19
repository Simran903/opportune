import express from "express";
import {
  signIn,
  signUp,
  updatePassword,
  userDetails,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/user-details", verifyToken as any, userDetails);
router.post("/update-password", verifyToken as any, updatePassword);

export default router;