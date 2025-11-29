import Fastify from "fastify";
import { redis } from "./redis";

const fastify = Fastify({ logger: true });

fastify.get("/device/:id/last-location", async (request, reply) => {
  const id = (request.params as any).id;

  const data = await redis.hgetall(`device:${id}`);

  if (!data || Object.keys(data).length === 0) {
    return reply.code(404).send({ message: "Device not found" });
  }

  return {
    deviceId: id,
    lat: Number(data.lat),
    lng: Number(data.lng),
    timestamp: Number(data.timestamp),
  };
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
