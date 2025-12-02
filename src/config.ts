import dotenv from "dotenv";
import mqtt from "mqtt/*";
dotenv.config();

export const config = {
  mqtt: {
    host: process.env.MQTT_HOST ?? "",
    port: Number(process.env.MQTT_PORT ?? 0),
    protocol: (process.env.MQTT_PROTOCOL ?? "ws") as mqtt.MqttProtocol,
    username: process.env.MQTT_USER ?? "",
    password: process.env.MQTT_PASSWORD ?? "",
  },
  db: {
    user: process.env.DB_USER ?? "",
    host: process.env.DB_HOST ?? "",
    database: process.env.DB_NAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    port: Number(process.env.DB_PORT ?? 0),
  },
  redis: {
    host: process.env.REDIS_HOST ?? "",
    port: Number(process.env.REDIS_PORT ?? 0),
  },
};
