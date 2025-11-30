import Redis from "ioredis";

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: Redis;

  private constructor() {}

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: "redis",
        port: 6379,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      RedisClient.instance.on("error", (err) => {
        console.error("Redis connection error:", err);
      });

      RedisClient.instance.on("connect", () => {
        console.log("✅ Redis connected");
      });
    }

    return RedisClient.instance;
  }

  static async close(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
    }
  }
}

export const redis = RedisClient.getInstance();
export { RedisClient };
