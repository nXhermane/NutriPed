import { Message } from "../../../../core/shared/application/Message";

describe("Message", () => {
  it("should create a new message with the correct properties", () => {
    const message = new Message("info", "This is a test message");
    expect(message.type).toBe("info");
    expect(message.content).toBe("This is a test message");
  });
});
