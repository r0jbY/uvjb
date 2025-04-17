import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { consumeUserCreatedEvents } from "./utils/userCreatedConsumer";

const PORT = process.env.PORT ?? 3002;


async function start() {
  await connectRabbitMQ();
  await consumeUserCreatedEvents();
}

start().catch((err) => {
  console.error("❌ Failed to start UserService:", err);
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
