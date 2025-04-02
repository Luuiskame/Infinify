import Redis from "ioredis";

// Load Redis URL from environment variables
const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false, // Needed for Upstash Redis on Vercel
  },
});

export default redis;
