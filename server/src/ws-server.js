import { app } from './src/app.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './socket/handlers/socket-handlers.js';

dotenv.config();

// Create HTTP server
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

// Start the WebSocket server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port: ${PORT}`);
});