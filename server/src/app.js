import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load env variables once during initialization
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
  ['http://localhost:3000'];

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));;


// Setup API routes
app.use('/infinify', routes);

// Add healthcheck endpoint for better debugging
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'healthcheck ok', timestamp: new Date().toISOString() });
});

export { app };