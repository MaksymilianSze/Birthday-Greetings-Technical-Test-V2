import { checkQueueMessage } from "./checkQueueMessage.js";
import logger from "../../../__mocks__/logger.js";

describe("checkQueueMessage", () => {
  it("should throw an error if no messages are found", () => {
    expect(() => {
      checkQueueMessage(null, logger);
    }).toThrow();
  });

  it("should not throw an error is message is found", () => {
    const mockMessages = [{ id: 1, message: "Hello" }];
    checkQueueMessage(mockMessages, logger);
  });

  it("should throw an error if messages is an empty object", () => {
    expect(() => {
      checkQueueMessage({}, logger);
    }).toThrow();
  });
});
