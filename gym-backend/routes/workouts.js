import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createWorkout,
  deleteWorkout,
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createWorkout);
router.get("/", getWorkouts);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);
router.post("/", createWorkout);
router.get("/:userId", getWorkouts);
router.get("/:userId/:workoutId", getWorkoutById);
router.put("/:workoutId", updateWorkout);
router.delete("/:workoutId", deleteWorkout);

export default router;
