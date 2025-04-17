import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startConsumer } from "./consumer";
const PORT = process.env.PORT ?? 3001;

async function start() {
  await connectRabbitMQ(); // 👈 Connect before starting Express
  await startConsumer();
  app.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
});

