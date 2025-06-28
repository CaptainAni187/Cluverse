import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import './utils/passport.js'; // Google OAuth config

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import regRoutes from './routes/registrations.js';
import adminRoutes from './routes/admin.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Log important environment variables
console.log('DEV_SKIP_OTP:', process.env.DEV_SKIP_OTP);
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug: Print MongoDB URI

// CORS & Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    // Add your deployed frontend URL here for production:
    // 'https://your-frontend-url.com',
  ],
  credentials: true,
}));
app.use(express.json());

// Sessions & Passport (for Google OAuth)
app.use(session({
  secret: process.env.JWT_SECRET || 'superSecret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', regRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message || String(err)
  });
});

// Mongo Connection
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in your .env file!');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected -> ' + process.env.MONGO_URI);
    app.listen(PORT, () => console.log('API running on port ' + PORT));
  })
  .catch(err => {
    console.error('MongoDB connection FAILED\n', err);
    process.exit(1);
  });

export default app;
