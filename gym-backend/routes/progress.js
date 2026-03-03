const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addProgress, getProgressByUserId } = require('../controllers/progressController');

const router = express.Router();

router.post('/', authMiddleware, addProgress);
router.get('/:userId', authMiddleware, getProgressByUserId);

module.exports = router;
