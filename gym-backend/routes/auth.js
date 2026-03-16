const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile
} = require('../controllers/authController');

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/profile", getProfile);

module.exports = router;