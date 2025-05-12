import {
  publishUserCreatedEvent,
  publishUserUpdatedEvent,
  publishUserDeletedEvent,
} from "../utils/publisher";
import * as rabbit from "../config/rabbitmq";
import { Channel } from "amqplib";

describe("Event Publishers", () => {
  const mockAssertQueue = jest.fn();
  const mockSendToQueue = jest.fn();

  beforeAll(() => {
    jest.spyOn(rabbit, "getChannel").mockReturnValue({
      assertQueue: mockAssertQueue,
      sendToQueue: mockSendToQueue,
    } as Partial<Channel> as Channel);
  });

  beforeEach(() => {
    mockAssertQueue.mockReset();
    mockSendToQueue.mockReset();
    mockSendToQueue.mockImplementation(() => true);
  });

  describe("publishUserCreatedEvent", () => {
    const testData = {
      uuid: "abc-123",
      firstName: "Alice",
      lastName: "Smith",
      phoneNumber: "+123456789",
      address: "123 Main St",
      active: true,
    };

    it("should publish a user.created event", async () => {
      await publishUserCreatedEvent(testData);

      expect(mockAssertQueue).toHaveBeenCalledWith("user.created", { durable: true });

      const bufferArg = mockSendToQueue.mock.calls[0][1];
      const message = JSON.parse(bufferArg.toString());

      expect(message).toMatchObject({
        type: "UserCreated",
        data: testData,
      });

      expect(typeof message.timestamp).toBe("string");

      expect(mockSendToQueue).toHaveBeenCalledWith("user.created", expect.any(Buffer), {
        persistent: true,
      });
    });

    it("should throw if sendToQueue fails", async () => {
      mockSendToQueue.mockImplementation(() => {
        throw new Error("RabbitMQ down");
      });

      await expect(publishUserCreatedEvent(testData)).rejects.toThrow("RabbitMQ down");
    });
  });

  describe("publishUserUpdatedEvent", () => {
    const testData = {
      id: "abc-123",
      firstName: "Alice",
      lastName: "Smith",
      phoneNumber: "+123456789",
      address: "123 Main St",
      active: true,
    };

    it("should publish a user.updated event", async () => {
      await publishUserUpdatedEvent(testData);

      expect(mockAssertQueue).toHaveBeenCalledWith("user.updated", { durable: true });

      const bufferArg = mockSendToQueue.mock.calls[0][1];
      const message = JSON.parse(bufferArg.toString());

      expect(message).toMatchObject({
        type: "UserUpdated",
        data: testData,
      });

      expect(typeof message.timestamp).toBe("string");

      expect(mockSendToQueue).toHaveBeenCalledWith("user.updated", expect.any(Buffer), {
        persistent: true,
      });
    });

    it("should throw if sendToQueue fails", async () => {
      mockSendToQueue.mockImplementation(() => {
        throw new Error("RabbitMQ unavailable");
      });

      await expect(publishUserUpdatedEvent(testData)).rejects.toThrow("RabbitMQ unavailable");
    });
  });

  describe("publishUserDeletedEvent", () => {
    const testData = { id: "abc-123" };

    it("should publish a user.deleted event", async () => {
      await publishUserDeletedEvent(testData);

      expect(mockAssertQueue).toHaveBeenCalledWith("user.deleted", { durable: true });

      const bufferArg = mockSendToQueue.mock.calls[0][1];
      const message = JSON.parse(bufferArg.toString());

      expect(message).toMatchObject({
        type: "UserDeleted",
        data: testData,
      });

      expect(typeof message.timestamp).toBe("string");

      expect(mockSendToQueue).toHaveBeenCalledWith("user.deleted", expect.any(Buffer), {
        persistent: true,
      });
    });

    it("should throw if sendToQueue fails", async () => {
      mockSendToQueue.mockImplementation(() => {
        throw new Error("Send failure");
      });

      await expect(publishUserDeletedEvent(testData)).rejects.toThrow("Send failure");
    });
  });
});
