import { checkMessage } from "./checkMessage";
import logger from "../../../__mocks__/logger";

describe("checkMessage", () => {
  const validMessage = "This is a valid message.";
  const invalidMessage = "This message is too long. ".repeat(1000);

  it("should return undefined when given a valid message", () => {
    expect(checkMessage(validMessage, logger)).toBeUndefined();
  });

  it("should throw an error when given an empty message", () => {
    expect(() => checkMessage("", logger)).toThrow();
  });

  it("should throw an error when given a message longer than 1000 characters", () => {
    expect(() => checkMessage(invalidMessage, logger)).toThrow();
  });

  it("should throw an error when given a null message", () => {
    expect(() => checkMessage(null, logger)).toThrow();
  });

  it("should throw an error when given an undefined message", () => {
    expect(() => checkMessage(undefined, logger)).toThrow();
  });
});
