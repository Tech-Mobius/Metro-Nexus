import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { ticketsRouter } from './routes/tickets.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration - support requests from frontend dev server
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Apply global rate limiting to all api endpoints
app.use('/api', apiLimiter);

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);

// Health check endpoint
app.get('/', (_, res) => {
  res.json({
    name: 'Metro Nexus Secure API',
    status: 'healthy',
    version: '1.0.0',
  });
});

// 404 Route handler
app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Metro Nexus backend listening on port ${PORT} in ${process.env.NODE_ENV ?? 'local'} mode.`);
});
