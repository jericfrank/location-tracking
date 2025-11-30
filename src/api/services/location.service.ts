import { pool } from "../../shared/database";
import { redis } from "../../shared/cache";
import { LocationPayload, NearbyDevice, DistanceResult, LocationHistory } from "../../types";

/**
 * Location service handles business logic for location operations
 */
export class LocationService {
  /**
   * Get the last known location for a device
   */
  async getLastLocation(deviceId: string): Promise<LocationPayload | null> {
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
   * Find devices within a radius of a location
   */
  async findNearbyDevices(
    lat: number,
    lng: number,
    radius: number
  ): Promise<NearbyDevice[]> {
    const result = await pool.query(
      `SELECT DISTINCT ON (device_id)
         device_id,
         lat,
         lng,
         timestamp,
         ST_Distance(
           geometry::geography,
           ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
         ) as distance
       FROM location_history
       WHERE ST_DWithin(
         geometry::geography,
         ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
         $3
       )
       ORDER BY device_id, timestamp DESC`,
      [lat, lng, radius]
    );

    return result.rows.map((row) => ({
      deviceId: row.device_id,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      distance: parseFloat(row.distance),
      timestamp: parseInt(row.timestamp),
    }));
  }

  /**
   * Calculate distance between two devices
   */
  async calculateDistance(device1: string, device2: string): Promise<DistanceResult | null> {
    const data1 = await redis.hgetall(`device:${device1}`);
    const data2 = await redis.hgetall(`device:${device2}`);

    if (!data1 || Object.keys(data1).length === 0) {
      throw new Error(`Device ${device1} not found or has no location data`);
    }

    if (!data2 || Object.keys(data2).length === 0) {
      throw new Error(`Device ${device2} not found or has no location data`);
    }

    const result = await pool.query(
      `SELECT ST_Distance(
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
       ) as distance`,
      [
        parseFloat(data1.lng),
        parseFloat(data1.lat),
        parseFloat(data2.lng),
        parseFloat(data2.lat),
      ]
    );

    return {
      device1,
      device2,
      distance: parseFloat(result.rows[0].distance),
    };
  }

  /**
   * Get location history for a device within a time range
   */
  async getLocationHistory(
    deviceId: string,
    start: number,
    end: number
  ): Promise<LocationHistory> {
    const result = await pool.query(
      `SELECT 
         device_id,
         ST_Y(geometry) as lat,
         ST_X(geometry) as lng,
         timestamp
       FROM location_history
       WHERE device_id = $1
         AND timestamp >= $2
         AND timestamp <= $3
       ORDER BY timestamp ASC`,
      [deviceId, start, end]
    );

    const locations = result.rows.map((row) => ({
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      timestamp: parseInt(row.timestamp),
    }));

    return {
      deviceId,
      locations,
    };
  }
}
