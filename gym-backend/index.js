require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'gym-backend' });
});

app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);
app.use('/progress', progressRoutes);

// 404 fallback for unknown endpoints.
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handler.
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`gym-backend server running on http://localhost:${PORT}`);
});
