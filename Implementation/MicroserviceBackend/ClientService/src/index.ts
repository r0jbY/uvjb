import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";


const PORT = Number(process.env.PORT) || 3002;


async function start() {
  if (process.env.SKIP_BROKER !== "true") {
    await connectRabbitMQ();
  }
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start ClientService:", err);
});
