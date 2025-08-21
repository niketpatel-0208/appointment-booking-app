    // api/src/server.js
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');

    const authRoutes = require('./routes/auth');
    const bookingRoutes = require('./routes/bookings');

    // --- CORS Configuration ---
    const allowedOrigins = [
      'http://localhost:5173',
      'https://appointment-booking-app-nu.vercel.app'
    ];

    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('This origin is not allowed by CORS'));
        }
      },
    };
    // --- End of CORS Configuration ---


    const app = express();
    const PORT = process.env.PORT || 5001;

    // Middleware
    app.use(cors(corsOptions));
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
    