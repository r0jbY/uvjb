import app from "./app";
import { connectRabbitMQ } from "./config/rabbitmq";


const PORT = process.env.PORT ?? 3003;


async function start() {
  await connectRabbitMQ();
 
}

start().catch((err) => {
  console.error("❌ Failed to start ClientService:", err);
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
