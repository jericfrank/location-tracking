import Redis from "ioredis";
import { config } from "../../config";

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: Redis;

  private constructor() {}

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        username: config.redis.username,
        password: config.redis.password,
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
