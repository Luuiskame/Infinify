import { app } from '../app.js';
import serverless from 'serverless-http';

// Simple test route for debugging
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Create the serverless handler with optimization options
const handler = serverless(app, {
  provider: {
    timeout: 10 // Explicitly set timeout to 10 seconds
  },
  binary: [
    'application/octet-stream',
    'application/json'
  ]
});

// Export the serverless handler with proper error handling
export default async (req, res) => {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('Serverless error:', error);
    
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
      });
    }
  }
};