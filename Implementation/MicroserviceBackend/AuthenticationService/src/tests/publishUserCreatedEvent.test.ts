import { publishUserCreatedEvent } from "../utils/publisher";
import * as rabbit from "../config/rabbitmq"; 
import { Channel } from "amqplib";

describe("publishUserCreatedEvent", () => {
  const mockAssertQueue = jest.fn();
  const mockSendToQueue = jest.fn();

  beforeAll(() => {
    // Mock the getChannel function
    jest.spyOn(rabbit, "getChannel").mockReturnValue({
      assertQueue: mockAssertQueue,
      sendToQueue: mockSendToQueue,
    } as Partial<Channel> as Channel); // 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should publish a user.created event to the queue", async () => {
    const testData = {
      uuid: "abc-123",
      firstName: "Alice",
      lastName: "Smith",
      phoneNumber: "+123456789",
      address: "123 Main St"
    };
  
    await publishUserCreatedEvent(testData);
  
    expect(mockAssertQueue).toHaveBeenCalledWith("user.created", { durable: true });
  
    
    const bufferArg = mockSendToQueue.mock.calls[0][1];
    const message = JSON.parse(bufferArg.toString());
  
    expect(message).toMatchObject({
      type: "UserCreated",
      data: testData
    });
  
    expect(typeof message.timestamp).toBe("string");

    expect(mockSendToQueue).toHaveBeenCalledWith("user.created",expect.any(Buffer),{ persistent: true });
  });
});
