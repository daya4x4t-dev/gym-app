import express from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile);

export default router;
