// src/consumers/userCreatedConsumer.ts
import { getChannel } from "../config/rabbitmq";
import { NetworkService } from "../services/NetworkService";
import { publishNotificationEmittedEvent } from "./publisher";

export async function consumeMeetingCreatedEvents() {
    const channel = getChannel();
    const queue = "meeting.created";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (!msg) return;
        try {
            const event = JSON.parse(msg.content.toString());
            console.log("📩 Received meeting.created event:", event);

            const data = event.data;

            const networkRes = await NetworkService.getNetwork(
                data.clientId,
                data.layer
            );

            console.log(networkRes);
            channel.ack(msg);

            const buddyIds = networkRes.map((b) => b.buddy_id);

            await publishNotificationEmittedEvent({ buddyIds, meetingId: data.meetingId });


            // TODO: [PRODUCTION] Add DLQ or retry system here!
            // In prod, we need to make sure bad events don't get lost

        } catch (err) {
            console.error("❌ Failed to process meeting.created event", err);
        }
    });
    console.log("📡 Listening to 'meeting.created' queue");
}
