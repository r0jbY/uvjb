import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";
const PORT = Number(process.env.PORT) ?? 3000;

async function start() {
  await connectRabbitMQ(); // 👈 Connect before starting Express
  app.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start AuthenticationService:", err);
});

