import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/create", createProfile);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
export default router;