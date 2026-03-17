import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import progressRoutes from "./routes/progress.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests", data: {} },
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// request logging middleware
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ok",
    data: { environment: NODE_ENV },
  });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/api/profile", profileRoutes); // backward-compatible alias
app.use("/workouts", workoutRoutes);
app.use("/progress", progressRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: {},
  });
});

app.use((err, _req, res, _next) => {
  if (err.message === "CORS blocked") {
    return res
      .status(403)
      .json({ success: false, message: "Origin not allowed", data: {} });
  }

  if (NODE_ENV === "development") {
    console.error("Server error:", err);
  }

  return res
    .status(500)
    .json({ success: false, message: "Internal server error", data: {} });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
