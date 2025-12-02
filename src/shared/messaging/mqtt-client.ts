import mqtt, { MqttClient } from "mqtt";
import { config } from "../../config";

/**
 * MQTT client singleton
 */
class MQTTClientManager {
  private static instance: MqttClient;

  private constructor() {}

  static getInstance(): MqttClient {
    if (!MQTTClientManager.instance) {
      MQTTClientManager.instance = mqtt.connect(config.mqtt);

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
