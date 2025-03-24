import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load env variables once during initialization
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true,
}));

// Remove session middleware completely since it's not needed

// Setup API routes
app.use('/infinify', routes);

// Add healthcheck endpoint for better debugging
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app };