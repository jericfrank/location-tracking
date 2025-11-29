import mqtt from "mqtt";

export const mqttClient = mqtt.connect({
  host: "emqx",
  port: 1883,
  protocol: "mqtt",
  username: "admin",
  password: "public",
});