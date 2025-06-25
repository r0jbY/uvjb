import { getChannel } from "../config/rabbitmq";


export async function publishNotificationEmittedEvent(data: {
  buddyIds: string[];
  meetingId: string
}) {
  const channel = getChannel();
  const queue = "notification.emitted";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    type: "NotificationEmitted",
    timestamp: new Date().toISOString(),
    data,
  };

  console.log("Data being sent:", data);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log("📤 Sent notification.emited event:", event);
}

