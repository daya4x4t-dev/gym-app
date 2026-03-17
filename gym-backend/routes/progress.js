import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addProgress,
  getProgress,
  getProgressSummary,
import {
  deleteProgress,
  getLatestProgress,
  getProgress,
  logProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", addProgress);
router.get("/", getProgress);
router.get("/summary", getProgressSummary);
router.post("/", logProgress);
router.get("/:userId/latest", getLatestProgress);
router.get("/:userId", getProgress);
router.delete("/:progressId", deleteProgress);

export default router;
