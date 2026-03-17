import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMyProfile);
router.put("/", updateMyProfile);
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
