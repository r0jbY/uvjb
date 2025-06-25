import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { consumeMeetingCreatedEvents } from "./utils/meetingCreatedConsumer";
const PORT = Number(process.env.PORT) || 3003;


async function start() {
  await connectRabbitMQ();
  await consumeMeetingCreatedEvents();
  app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
}

start().catch((err) => {
  console.error("❌ Failed to start ClientNetowrkService:", err);
});

