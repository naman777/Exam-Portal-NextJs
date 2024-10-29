import Redis from 'ioredis';

let redis: Redis | undefined;

declare global {
  // Extend global type to include redisClient for reuse in non-production environments
  var redisClient: Redis | undefined;
}

const createRedisClient = () => {
  if (!global.redisClient) {
    console.log('Initializing new Redis client...');

    global.redisClient = new Redis(process.env.REDIS_URL!);

    global.redisClient.on('error', (err: any) => {
      console.error('Redis connection error:', err);
    });

    global.redisClient.on('connect', () => {
      console.log('Connected to Redis server');
    });
  }

  redis = global.redisClient; // Reuse the existing client

  return redis;
};

const redisClient = createRedisClient();

export default redisClient;
