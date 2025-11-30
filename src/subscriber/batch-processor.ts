import PQueue from "p-queue";
import { pool } from "../shared/database";
import { LocationPayload } from "../types";
import { BATCH_CONFIG } from "./config";

/**
 * BatchProcessor handles batching and bulk insertion of location data
 */
export class BatchProcessor {
  private queue: PQueue;
  private locationBatch: LocationPayload[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.queue = new PQueue({ concurrency: BATCH_CONFIG.QUEUE_CONCURRENCY });
  }

  /**
   * Add a location to the batch
   */
  add(location: LocationPayload): void {
    this.locationBatch.push(location);

    // Flush if batch size reached
    if (this.locationBatch.length >= BATCH_CONFIG.BATCH_SIZE) {
      this.flush();
    } else {
      // Reset timer - flush after interval if no more messages
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
      }
      this.batchTimer = setTimeout(() => this.flush(), BATCH_CONFIG.BATCH_INTERVAL);
    }
  }

  /**
   * Flush the current batch to the database
   */
  async flush(): Promise<void> {
    if (this.locationBatch.length === 0) return;

    const batch = [...this.locationBatch];
    this.locationBatch = [];

    // Clear the timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Add batch insert to queue
    this.queue.add(async () => {
      try {
        console.log(`💾 Flushing batch of ${batch.length} locations to database`);

        // Build bulk insert query
        const values: any[] = [];
        const placeholders: string[] = [];

        batch.forEach((location, index) => {
          const offset = index * 5;
          placeholders.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3}, ST_SetSRID(ST_MakePoint($${offset + 4}, $${offset + 2}), 4326), $${offset + 5})`
          );
          values.push(
            location.deviceId,
            location.lat,
            location.lng,
            location.lng, // longitude for ST_MakePoint
            location.timestamp
          );
        });

        const query = `
          INSERT INTO location_history (device_id, lat, lng, geometry, timestamp)
          VALUES ${placeholders.join(", ")}
        `;

        await pool.query(query, values);
        console.log(`✅ Successfully saved ${batch.length} locations`);
      } catch (error) {
        console.error("❌ Error flushing batch to database:", error);
      }
    });
  }

  /**
   * Wait for all queued batches to complete
   */
  async waitForCompletion(): Promise<void> {
    await this.queue.onIdle();
  }

  /**
   * Get current batch size
   */
  getBatchSize(): number {
    return this.locationBatch.length;
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      batchSize: this.locationBatch.length,
      queueSize: this.queue.size,
      queuePending: this.queue.pending,
    };
  }
}
