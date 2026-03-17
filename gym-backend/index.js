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

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// =======================
// 🔒 SECURITY HEADERS
// =======================
app.use(helmet());

// =======================
// 🔥 CORS CONFIG
// =======================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ Now safe — origin is handled dynamically
  })
);

// =======================
// 🔥 RATE LIMITING
// =======================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Strict limit for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

app.use(globalLimiter);

// =======================
// 🔥 MIDDLEWARES
// =======================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =======================
// 🔥 REQUEST TIMEOUT (15s)
// =======================
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    res.status(408).json({
      success: false,
      message: "Request timeout. Please try again.",
    });
  });
  next();
});

// =======================
// 🔥 HTTP LOGGER
// =======================
if (NODE_ENV === "development") {
  app.use(morgan("dev")); // Colored, concise logs
} else {
  app.use(morgan("combined")); // Full Apache-style logs for production
}

// =======================
// 🔥 HEALTH CHECK
// =======================
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "gym-backend",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// =======================
// 🔥 ROUTES
// =======================
app.use("/auth", authLimiter, authRoutes);       // 🔒 Rate limited
app.use("/api/profile", profileRoutes);
app.use("/workouts", workoutRoutes);
app.use("/progress", progressRoutes);

// =======================
// ❌ 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =======================
// ❌ GLOBAL ERROR HANDLER
// =======================
app.use((err, _req, res, _next) => {
  // Handle CORS errors specifically
  if (err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // Log full error in development only
  if (NODE_ENV === "development") {
    console.error("🔥 SERVER ERROR:", err.stack || err);
  } else {
    console.error("🔥 SERVER ERROR:", err.message);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      NODE_ENV === "development"
        ? err.message || "Internal server error"
        : "Internal server error", // Hide details in production
  });
});

// =======================
// 🚀 START SERVER
// =======================
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// =======================
// 🔥 GRACEFUL SHUTDOWN
// =======================
const shutdown = (signal) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled Promise Rejection:", reason);
  process.exit(1);
});

export default app;