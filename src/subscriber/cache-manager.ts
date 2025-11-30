import { redis } from "../shared/cache";
import { LocationPayload } from "../types";

/**
 * CacheManager handles Redis caching of latest device locations
 */
export class CacheManager {
  /**
   * Update the latest location for a device in Redis
   */
  async updateLocation(location: LocationPayload): Promise<void> {
    const { deviceId, lat, lng, timestamp } = location;

    await redis.hset(`device:${deviceId}`, {
      lat,
      lng,
      timestamp,
    });
  }

  /**
   * Get the latest location for a device from Redis
   */
  async getLocation(deviceId: string): Promise<LocationPayload | null> {
    const data = await redis.hgetall(`device:${deviceId}`);

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      deviceId,
      lat: Number(data.lat),
      lng: Number(data.lng),
      timestamp: Number(data.timestamp),
    };
  }

  /**
   * Delete a device's location from Redis
   */
  async deleteLocation(deviceId: string): Promise<void> {
    await redis.del(`device:${deviceId}`);
  }
}
