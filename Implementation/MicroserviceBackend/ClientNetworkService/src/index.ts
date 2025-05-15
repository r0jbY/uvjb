import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";

const PORT = Number(process.env.PORT) || 3003;


async function start() {
  await connectRabbitMQ();
  app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
}

start().catch((err) => {
  console.error("❌ Failed to start ClientNetowrkService:", err);
});

