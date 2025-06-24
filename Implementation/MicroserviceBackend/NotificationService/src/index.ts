import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { consumeUserCreatedEvents } from "./utils/userCreatedConsumer";


const PORT = Number(process.env.PORT) || 3001;


async function start() {
  await connectRabbitMQ();
  app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
}

start().catch((err) => {
  console.error("❌ Failed to start UserService:", err);
});


