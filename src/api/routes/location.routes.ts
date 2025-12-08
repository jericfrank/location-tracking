import { FastifyInstance } from "fastify";
import { LocationController } from "../controllers";

/**
 * Register location routes
 */
export function registerLocationRoutes(
  fastify: FastifyInstance,
  controller: LocationController
) {
  // GET /device/:id/last-location
  fastify.get("/device/:id/last-location", (request, reply) =>
    controller.getLastLocation(request, reply)
  );

  // GET /devices/nearby
  fastify.get("/devices/nearby", (request, reply) =>
    controller.getNearbyDevices(request, reply)
  );

  // GET /devices/distance
  fastify.get("/devices/distance", (request, reply) =>
    controller.getDistance(request, reply)
  );

  fastify.get("/devices/last-locations", (request, reply) =>
    controller.getAllLastLocation(request, reply)
  );

  // GET /device/:id/history
  fastify.get("/device/:id/history", (request, reply) =>
    controller.getHistory(request, reply)
  );
}
