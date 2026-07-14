import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { ticketsRouter } from './routes/tickets.js';
import { paymentsRouter } from './routes/payments.js';
import { apiLimiter } from './middleware/rateLimiter.js';


dotenv.config();


connectDB();

const app = express();
const PORT = process.env.PORT || 4000;


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(express.json());


app.use('/api', apiLimiter);


app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/payments', paymentsRouter);


app.get('/', (_, res) => {
  res.json({
    name: 'Metro Nexus Secure API',
    status: 'healthy',
    version: '1.0.0',
  });
});


app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});


app.listen(PORT, () => {
  console.log(`Metro Nexus backend listening on port ${PORT} in ${process.env.NODE_ENV ?? 'local'} mode.`);
});
