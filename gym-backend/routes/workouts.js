import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createWorkout);
router.get("/", getWorkouts);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
