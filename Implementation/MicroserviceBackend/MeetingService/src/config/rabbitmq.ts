// src/config/rabbitmq.ts
import amqp from "amqplib";

let channel: amqp.Channel;

/** Connect (or reuse) a RabbitMQ channel */
export async function connectRabbitMQ(): Promise<amqp.Channel> {
  if (channel) return channel;  // singleton pattern

  // 1️⃣ grab from env, fallback to localhost for one‑off dev
  const RABBITMQ_URL =
    process.env.RABBITMQ_URL ?? "amqp://localhost:5672";

  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  console.log(`🟢 Connected to RabbitMQ at ${RABBITMQ_URL}`); 
  return channel;
}

/** Get the already‑established channel (after connectRabbitMQ) */
export function getChannel(): amqp.Channel {
  if (!channel)
    throw new Error("RabbitMQ channel not initialized. Call connectRabbitMQ() first.");
  return channel;
}
