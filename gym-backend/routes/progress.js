import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addProgress,
  getProgress,
  getProgressSummary,
} from "../controllers/progressController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", addProgress);
router.get("/", getProgress);
router.get("/summary", getProgressSummary);

export default router;
