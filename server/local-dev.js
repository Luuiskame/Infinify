import { PORT } from './config.js';
import { app } from './src/app.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './src/socket/handlers/socket-handlers.js';

dotenv.config();

// Create a single HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with this server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

// Set up all socket handlers
setupSocketHandlers(io);

// Start the combined server
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port: ${PORT}`);
});