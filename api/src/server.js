// api/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || 'https://your-frontend-domain.vercel.app'
    : true,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running!', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

module.exports = app;
