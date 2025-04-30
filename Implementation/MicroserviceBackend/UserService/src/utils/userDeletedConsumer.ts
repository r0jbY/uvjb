import { getChannel } from "../config/rabbitmq";
import { UserService } from "../services/UserService";

export async function consumeUserDeletedEvents() {
    const channel = getChannel();
    const queue = "user.deleted";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            console.log("📩 Received user.deleted event:", event);

            const data = event.data;

            await UserService.deleteUser(
                data.id
            );

            channel.ack(msg);

            // TODO: [PRODUCTION] Add DLQ or retry system here!
            // In prod, we need to make sure bad events don't get lost

        } catch (err) {
            console.error("❌ Failed to process user.deleted event", err);
        }
    });

    console.log("📡 Listening to 'user.deleted' queue");
}
