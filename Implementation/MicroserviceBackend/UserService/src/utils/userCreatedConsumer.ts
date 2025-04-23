// src/consumers/userCreatedConsumer.ts
import { getChannel } from "../config/rabbitmq";
import { UserService } from "../services/UserService";

export async function consumeUserCreatedEvents() {
    const channel = getChannel();
    const queue = "user.created";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            console.log("📩 Received user.created event:", event);

            const data = event.data;

            await UserService.createUser(
                data.uuid,
                data.firstName,
                data.lastName,
                data.phoneNumber,
                data.address,
                data.role
            );

            channel.ack(msg);

            // TODO: [PRODUCTION] Add DLQ or retry system here!
            // In prod, we need to make sure bad events don't get lost

        } catch (err) {
            console.error("❌ Failed to process user.created event", err);
        }
    });

    console.log("📡 Listening to 'user.created' queue");
}
