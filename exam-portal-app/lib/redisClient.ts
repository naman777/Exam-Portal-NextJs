import Redis from 'ioredis';

let redisClient: Redis | null = null;

const createRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL!);

    redisClient.on('error', (err: any) => {
      console.error('Redis connection error:', err);
    });

    // Optional: Add a listener for successful connection
    redisClient.on('connect', () => {
      console.log('Connected to Redis server');
    });
  }

  return redisClient;
};

export default createRedisClient;
