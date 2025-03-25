import { app } from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './socket/handlers/socket-handlers.js';

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// In ws-server.js
const allowedWsOrigins = process.env.ALLOWED_WS_ORIGINS 
  ? process.env.ALLOWED_WS_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://infinify-v1.vercel.app'];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedWsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});


// Set up all socket handlers
setupSocketHandlers(io);

// Start the WebSocket server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port: ${PORT}`);
});