import Fastify from "fastify";
import { LocationService } from "./services";
import { LocationController } from "./controllers";
import { registerLocationRoutes } from "./routes";
import { config } from "../config";

/**
 * Create and configure the Fastify server
 */
export function createServer() {
  const fastify = Fastify({ logger: true });

  // Initialize services and controllers
  const locationService = new LocationService();
  const locationController = new LocationController(locationService);

  // Register routes
  registerLocationRoutes(fastify, locationController);

  // Health check endpoint
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: Date.now() };
  });

  return fastify;
}

/**
 * Start the API server
 */
export async function startServer() {
  const fastify = createServer();

  try {
    await fastify.listen({ port: config.host.port, host: "0.0.0.0" });
    console.log(`🚀 API server started on port ${config.host.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
