import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

// Get all workouts
router.get("/", getWorkouts);

// Get workout by ID
router.get("/:id", getWorkoutById);

// Create workout (protected)
router.post("/", authMiddleware, createWorkout);

// Update workout (protected)
router.put("/:id", authMiddleware, updateWorkout);

// Delete workout (protected)
router.delete("/:id", authMiddleware, deleteWorkout);

export default router;