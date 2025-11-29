import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("🚀 Publisher connected");

  const deviceId = "driver_001";

  setInterval(() => {
    const payload = {
      deviceId,
      lat: 14.5547 + Math.random() * 0.001,
      lng: 121.0244 + Math.random() * 0.001,
      timestamp: Date.now(),
    };

    client.publish(`location/${deviceId}`, JSON.stringify(payload));
    console.log("📨 Sent:", payload);
  }, 2000);
});