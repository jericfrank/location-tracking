import mqtt, { MqttClient } from "mqtt";

/**
 * MQTT client singleton
 */
class MQTTClientManager {
  private static instance: MqttClient;

  private constructor() {}

  static getInstance(): MqttClient {
    if (!MQTTClientManager.instance) {
      MQTTClientManager.instance = mqtt.connect({
        host: "emqx",
        port: 1883,
        protocol: "mqtt",
        username: "admin",
        password: "public",
      });

      MQTTClientManager.instance.on("error", (err) => {
        console.error("MQTT connection error:", err);
      });
    }

    return MQTTClientManager.instance;
  }

  static async close(): Promise<void> {
    if (MQTTClientManager.instance) {
      await MQTTClientManager.instance.endAsync();
    }
  }
}

export const mqttClient = MQTTClientManager.getInstance();
export { MQTTClientManager };
