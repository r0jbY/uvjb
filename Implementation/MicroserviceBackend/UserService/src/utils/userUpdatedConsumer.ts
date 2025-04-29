import { getChannel } from "../config/rabbitmq";
import { UserService } from "../services/UserService";

export async function consumeUserUpdatedEvents() {

    const channel = getChannel();
    const queue = "user.updated";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            console.log("📩 Received user.updated event:", event);

            const data = event.data;

            await UserService.updateUser(
                data.id,
                data.firstName,
                data.lastName,
                data.address,
                data.phoneNumber,
                data.active
            );

            channel.ack(msg);

            // TODO: [PRODUCTION] Add DLQ or retry system here!
            // In prod, we need to make sure bad events don't get lost

        } catch (err) {
            console.error("❌ Failed to process user.created event", err);
        }
    });

    console.log("📡 Listening to 'user.updated' queue");
}