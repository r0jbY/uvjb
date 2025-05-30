import { getChannel } from "../config/rabbitmq";


export async function publishUserCreatedEvent(data: {
  uuid: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  active: boolean
}) {
  const channel = getChannel();
  const queue = "user.created";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    type: "UserCreated",
    timestamp: new Date().toISOString(),
    data,
  };

  console.log("Data being sent:", data);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log("📤 Sent user.created event:", event);
}

export async function publishUserUpdatedEvent(data: {
  id: string,
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  active: boolean
}) {
  const channel = getChannel();
  const queue = "user.updated";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    type: "UserUpdated",
    timestamp: new Date().toISOString(),
    data,
  };

  console.log("Data being sent:", data);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log("📤 Sent user.updated event:", event);
}

export async function publishUserDeletedEvent(data: {
  id: string,
}) {
  const channel = getChannel();
  const queue = "user.deleted";

  await channel.assertQueue(queue, { durable: true });

  const event = {
    type: "UserDeleted",
    timestamp: new Date().toISOString(),
    data,
  };

  console.log("Data being sent:", data);

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  console.log("📤 Sent user.deleted event:", event);
}