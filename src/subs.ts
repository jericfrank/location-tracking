import { mqttClient } from "./mqtt";
import { pool } from "./pg";
import { redis } from "./redis";
import { LocationPayload } from "./types";

mqttClient.on("connect", () => {
  console.log("📡 MQTT Subscriber connected");
  mqttClient.subscribe("location/#");
});

mqttClient.on("message", async (topic, message) => {
  const data: LocationPayload = JSON.parse(message.toString());

  const { deviceId, lat, lng, timestamp } = data;
  console.log(`📍 Received [${deviceId}]:`, data);

  await redis.hset(`device:${deviceId}`, {
    lat,
    lng,
    timestamp,
  });

  await pool.query(
    `INSERT INTO location_history (device_id, lat, lng, timestamp)
     VALUES ($1, $2, $3, $4)`,
    [deviceId, lat, lng, timestamp]
  );
});
