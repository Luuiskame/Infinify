import { createClient } from 'redis';

// Create a factory function to get Redis client
export async function getRedisClient() {
  // Create a new client
  const client = createClient({
    username: 'default',
    password: 'JMtTkSGYJ9AVeZMf2SdAyrCyJAHjhnh7',
    socket: {
      host: 'redis-15639.c275.us-east-1-4.ec2.redns.redis-cloud.com',
      port: 15639
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