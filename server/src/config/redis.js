import { createClient } from 'redis';

import dotenv from 'dotenv';

dotenv.config();

// Create a factory function to get Redis client
export async function getRedisClient() {
  // Create a new client
  const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379')
    }
  });

  // Set up error handler
  client.on('error', err => {
    console.error('Redis Client Error', err);
  });

  // Connect if not already connected
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}