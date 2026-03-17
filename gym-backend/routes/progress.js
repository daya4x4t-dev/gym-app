import express from "express";

const router = express.Router();

// Example: Add progress
router.post("/", (req, res) => {
  const { userId, weight, date } = req.body;

  res.json({
    message: "Progress added successfully",
    data: { userId, weight, date }
  });
});

// Example: Get progress by user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  res.json({
    message: "User progress fetched",
    userId
  });
});

export default router;  