import { getChannel } from "../config/rabbitmq";


export async function publishMeetingCreatedEvent(data: {
  clientId: string;
  layer: number;
  meetingId: string;
}) {
  const channel = getChannel();
  const queue = "meeting.created";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    type: "MeetingCreated",
    timestamp: new Date().toISOString(),
    data,
  };

  console.log("Data being sent:", data);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log("📤 Sent meeting.created event:", event);
}

