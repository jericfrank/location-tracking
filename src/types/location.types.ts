/**
 * Location data types
 */

export interface LocationPayload {
  deviceId: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export interface NearbyDevice {
  deviceId: string;
  lat: number;
  lng: number;
  distance: number;
  timestamp: number;
}

export interface DistanceResult {
  device1: string;
  device2: string;
  distance: number;
}

export interface LocationHistory {
  deviceId: string;
  locations: LocationPoint[];
}

export interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: number;
}
