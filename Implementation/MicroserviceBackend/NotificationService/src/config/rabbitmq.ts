// src/config/rabbitmq.ts
import * as amqp from "amqplib";

let channel: amqp.Channel | null = null;
let connection: amqp.ChannelModel;

/** Connect (or reuse) a RabbitMQ channel */
export async function connectRabbitMQ(): Promise<amqp.Channel> {
  if (channel) return channel;  // singleton pattern

  // 1️⃣ grab from env, fallback to localhost for one‑off dev
  const RABBITMQ_URL =
    process.env.RABBITMQ_URL ?? "amqp://localhost:5672";

   connection = await amqp.connect(RABBITMQ_URL);
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

export async function closeRabbitMQ() {
  console.log("We are here now!")
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
     if (connection) await connection.close();
    console.log("🛑 RabbitMQ connection closed.");
  } catch (err) {
    console.error("❌ Error closing RabbitMQ connection:", err);
  }
}
