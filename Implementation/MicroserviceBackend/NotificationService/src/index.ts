import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { consumeNotificationEmittedEvents } from "./utils/notificationEmittedConsumer";


const PORT = Number(process.env.PORT) || 3001;


async function start() {
  await connectRabbitMQ();
  await consumeNotificationEmittedEvents();
  app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
}

start().catch((err) => {
  console.error("❌ Failed to start UserService:", err);
});


