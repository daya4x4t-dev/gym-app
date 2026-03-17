import express from "express";
import {
  createProfile,
  deleteProfile,
  deleteProfilePhoto,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/create", createProfile);
router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);
router.delete("/:userId", deleteProfile);
router.post("/:userId/photo", uploadProfilePhoto);
router.delete("/:userId/photo", deleteProfilePhoto);

export default router;
