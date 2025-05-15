// src/tests/integration/userCreatedConsumer.integration.test.ts
import amqp from "amqplib";
import { consumeUserCreatedEvents } from "../../utils/userCreatedConsumer";
import { connectRabbitMQ, getChannel, closeRabbitMQ } from "../../config/rabbitmq";
import { prisma } from "../../config/database";
import { consumeUserDeletedEvents } from "../../utils/userDeletedConsumer";
import { consumeUserUpdatedEvents } from "../../utils/userUpdatedConsumer";
import { seedUsers } from "../../prisma/seed";

beforeAll(async () => {
    await connectRabbitMQ();
    await consumeUserCreatedEvents(); // start consuming
    await consumeUserDeletedEvents();
    await consumeUserUpdatedEvents();
});

afterAll(async () => {
    await closeRabbitMQ();
    await seedUsers();
});

describe("RabbitMQ - user.created consumer", () => {
    const QUEUE = "user.created";



    afterEach(async () => {
        // Cleanup created users
        await prisma.user.deleteMany({ where: { id: "77777777-7777-7777-7777-777777777777@example.com" } });
    });



    it("should consume user.created event and create user in DB", async () => {
        const channel = getChannel();

        const testEvent = {
            data: {
                uuid: "77777777-7777-7777-7777-777777777777",
                firstName: "Event",
                lastName: "User",
                phoneNumber: "+31111222333",
                address: "Event Street",
                active: true
            }
        };

        await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(testEvent)), {
            persistent: true
        });

        // Wait a bit for the consumer to process the message
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = await prisma.user.findUnique({
            where: { id: testEvent.data.uuid }
        });

        expect(user).not.toBeNull();
        expect(user?.first_name).toBe("Event");
        expect(user?.last_name).toBe("User");
    });
});

describe("RabbitMQ - user.deleted consumer", () => {
    const QUEUE = "user.deleted";

    it("should consume user.deleted event and delete user in DB", async () => {
        const channel = getChannel();

        const testEvent = {
            data: {
                id: "30000000-0000-0000-0000-000000000005",
            }
        };

        await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(testEvent)), {
            persistent: true
        });

        // Wait a bit for the consumer to process the message
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = await prisma.user.findUnique({
            where: { id: testEvent.data.id }
        });

        expect(user).toBeNull();
    });
});

describe("RabbitMQ - user.updated consumer", () => {
    const QUEUE = "user.updated";

    it("should consume user.updated event and update user in DB", async () => {
        const channel = getChannel();

        const testEvent = {
            data: {
                id: "30000000-0000-0000-0000-000000000004",
                firstName: "Update",
                lastName: "Event",
                phoneNumber: "+31111222333",
                address: "Event Street",
                active: true
            }
        };

        await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(testEvent)), {
            persistent: true
        });

        // Wait a bit for the consumer to process the message
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = await prisma.user.findUnique({
            where: { id: testEvent.data.id }
        });

        expect(user).not.toBeNull();
        expect(user?.first_name).toBe("Update");
        expect(user?.last_name).toBe("Event");
    });
});
