import express from "express";

import {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile
} from "../controllers/authController.js";

const router = express.Router();

// =======================
// AUTH ROUTES
// =======================

// Register new user
router.post("/signup", signup);

// Login user
router.post("/login", login);

// Send password reset email
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset password
router.post("/reset-password", resetPassword);

// Get user profile
router.get("/profile", getProfile);

export default router;