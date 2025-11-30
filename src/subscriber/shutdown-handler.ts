import { BatchProcessor } from "./batch-processor";

/**
 * ShutdownHandler manages graceful shutdown of the subscriber service
 */
export class ShutdownHandler {
  constructor(private batchProcessor: BatchProcessor) {
    this.registerHandlers();
  }

  /**
   * Register signal handlers for graceful shutdown
   */
  private registerHandlers(): void {
    process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
    process.on("SIGINT", () => this.handleShutdown("SIGINT"));
  }

  /**
   * Handle shutdown signal
   */
  private async handleShutdown(signal: string): Promise<void> {
    console.log(`🛑 ${signal} received, flushing remaining batch...`);

    try {
      // Flush any remaining batch
      await this.batchProcessor.flush();

      // Wait for all queued tasks to complete
      await this.batchProcessor.waitForCompletion();

      console.log("✅ All batches flushed, exiting...");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  }
}
