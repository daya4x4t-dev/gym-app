const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
