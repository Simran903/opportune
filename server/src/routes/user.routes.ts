import express from "express";
import {
  signIn,
  signUp,
  updatePassword,
  userDetails,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/user-details").get(verifyToken as any, userDetails);
router.route("/update-password").post(verifyToken as any, updatePassword);

export default router;
