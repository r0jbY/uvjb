// src/consumers/userCreatedConsumer.ts
import { getChannel } from "../config/rabbitmq";
import NotificationController from "../controllers/NotificationController";

export async function consumeNotificationEmittedEvents() {
    const channel = getChannel();
    const queue = "notification.emitted";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (!msg) return;
        try {
            const event = JSON.parse(msg.content.toString());
            console.log("📩 Received notification.emitted event:", event);

            const data = event.data;

            channel.ack(msg);

            await NotificationController.handleNotificationEmittedEvent(data.buddyIds, data.meetingId);

            // TODO: [PRODUCTION] Add DLQ or retry system here!
            // In prod, we need to make sure bad events don't get lost

        } catch (err) {
            console.error("❌ Failed to process notification.emitted event", err);
        }
    });
    console.log("📡 Listening to 'notification.emitted' queue");
}
