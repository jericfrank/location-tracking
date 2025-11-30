import { LocationPayload } from "../types";
import { BatchProcessor } from "./batch-processor";
import { CacheManager } from "./cache-manager";

/**
 * MessageHandler processes incoming MQTT location messages
 */
export class MessageHandler {
  constructor(
    private batchProcessor: BatchProcessor,
    private cacheManager: CacheManager
  ) {}

  /**
   * Process an incoming location message
   */
  async handle(message: Buffer): Promise<void> {
    try {
      const data: LocationPayload = JSON.parse(message.toString());

      console.log(`📍 Received [${data.deviceId}]:`, data);

      // Validate location data
      if (!this.isValidLocation(data)) {
        console.error("❌ Invalid location data:", data);
        return;
      }

      // Update Redis cache with latest location (immediate)
      await this.cacheManager.updateLocation(data);

      // Add to batch for database insert (batched via p-queue)
      this.batchProcessor.add(data);
    } catch (error) {
      console.error("❌ Error processing location message:", error);
      // Continue processing subsequent messages
    }
  }

  /**
   * Validate location data
   */
  private isValidLocation(data: LocationPayload): boolean {
    const { deviceId, lat, lng, timestamp } = data;

    // Check required fields
    if (!deviceId || lat === undefined || lng === undefined || !timestamp) {
      return false;
    }

    // Validate latitude range (-90 to 90)
    if (lat < -90 || lat > 90) {
      return false;
    }

    // Validate longitude range (-180 to 180)
    if (lng < -180 || lng > 180) {
      return false;
    }

    // Validate timestamp is positive
    if (timestamp < 0) {
      return false;
    }

    return true;
  }
}
