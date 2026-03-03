const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');

const router = express.Router();

router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', authMiddleware, createWorkout);
router.put('/:id', authMiddleware, updateWorkout);
router.delete('/:id', authMiddleware, deleteWorkout);

module.exports = router;
