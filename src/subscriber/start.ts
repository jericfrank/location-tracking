import { mqttClient } from "../shared/messaging";
import { BatchProcessor } from "./batch-processor";
import { CacheManager } from "./cache-manager";
import { MessageHandler } from "./message-handler";
import { ShutdownHandler } from "./shutdown-handler";

export function startSubscriber(): void {
  const batchProcessor = new BatchProcessor();
  const cacheManager = new CacheManager();
  const messageHandler = new MessageHandler(batchProcessor, cacheManager);
  const shutdownHandler = new ShutdownHandler(batchProcessor);

  void shutdownHandler; // Registers signal handlers in constructor

  mqttClient.on("connect", () => {
    console.log("📡 MQTT Subscriber connected");
    mqttClient.subscribe("location/#");
  });

  // Handle incoming messages
  mqttClient.on("message", async (_topic, message) => {
    await messageHandler.handle(message);
  });

  // Log connection errors
  mqttClient.on("error", (error) => {
    console.error("❌ MQTT connection error:", error);
  });

  console.log("🚀 Location subscriber service started");
}
