import { FastifyRequest, FastifyReply } from "fastify";
import { LocationService } from "../services";

/**
 * Location controller handles HTTP requests for location endpoints
 */
export class LocationController {
  constructor(private locationService: LocationService) {}

  /**
   * GET /device/:id/last-location
   */
  async getLastLocation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const location = await this.locationService.getLastLocation(id);

      if (!location) {
        return reply.code(404).send({ message: "Device not found" });
      }

      return location;
    } catch (error) {
      console.error("Error getting last location:", error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }

  /**
   * GET /devices/last-locations
   */
  async getLastLocations(
    request: FastifyRequest<{ Body: { ids: string[] } }>,
    reply: FastifyReply
  ) {
    const { ids } = request.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.code(400).send({ message: "No device IDs provided" });
    }

    try {
      const locations = await this.locationService.getLastLocations(ids);

      if (!locations || locations.length === 0) {
        return reply.code(404).send({ message: "Devices not found" });
      }

      return reply.code(200).send({ locations });
    } catch (error) {
      console.error("Error getting last locations:", error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }

  /**
   * GET /devices/nearby
   */
  async getNearbyDevices(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const lat = parseFloat(query.lat);
      const lng = parseFloat(query.lng);
      const radius = parseFloat(query.radius);

      // Validate parameters
      if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        return reply.code(400).send({
          message: "Invalid parameters. Required: lat, lng, radius (in meters)",
        });
      }

      if (radius > 100000) {
        return reply.code(400).send({
          message: "Radius cannot exceed 100000 meters (100km)",
        });
      }

      const devices = await this.locationService.findNearbyDevices(lat, lng, radius);
      return devices;
    } catch (error) {
      console.error("Error finding nearby devices:", error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }

  /**
   * GET /devices/distance
   */
  async getDistance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const { device1, device2 } = query;

      // Validate parameters
      if (!device1 || !device2) {
        return reply.code(400).send({
          message: "Invalid parameters. Required: device1, device2",
        });
      }

      const result = await this.locationService.calculateDistance(device1, device2);
      return result;
    } catch (error: any) {
      console.error("Error calculating distance:", error);

      if (error.message?.includes("not found")) {
        return reply.code(404).send({ message: error.message });
      }

      return reply.code(500).send({ message: "Internal server error" });
    }
  }

  /**
   * GET /device/:id/history
   */
  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const query = request.query as any;
      const start = query.start ? parseInt(query.start) : 0;
      const end = query.end ? parseInt(query.end) : Date.now();

      // Validate parameters
      if (isNaN(start) || isNaN(end)) {
        return reply.code(400).send({
          message: "Invalid parameters. start and end must be valid timestamps",
        });
      }

      if (start > end) {
        return reply.code(400).send({
          message: "start timestamp must be less than or equal to end timestamp",
        });
      }

      const history = await this.locationService.getLocationHistory(id, start, end);
      return history;
    } catch (error) {
      console.error("Error getting location history:", error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }
}
