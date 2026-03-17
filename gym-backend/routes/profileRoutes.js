import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMyProfile);
router.put("/", updateMyProfile);

export default router;
