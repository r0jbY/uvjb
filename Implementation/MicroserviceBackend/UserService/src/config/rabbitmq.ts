import amqp from "amqplib";

let channel : amqp.Channel;

export async function connectRabbitMQ() {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMq");

    return channel;
}

export function getChannel(): amqp.Channel {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;
}