import express from "express";
import {
  deleteProgress,
  getLatestProgress,
  getProgress,
  logProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/", logProgress);
router.get("/:userId/latest", getLatestProgress);
router.get("/:userId", getProgress);
router.delete("/:progressId", deleteProgress);

export default router;
