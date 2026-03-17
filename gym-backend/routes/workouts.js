import express from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/", createWorkout);
router.get("/:userId", getWorkouts);
router.get("/:userId/:workoutId", getWorkoutById);
router.put("/:workoutId", updateWorkout);
router.delete("/:workoutId", deleteWorkout);

export default router;
