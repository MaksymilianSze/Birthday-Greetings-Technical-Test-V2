import { checkPhoneNumber } from "./checkPhoneNumber.js";
import logger from "../../../__mocks__/logger";

describe("checkPhoneNumber", () => {
  it("should throw an error if phone number is missing", () => {
    expect(() => checkPhoneNumber(undefined, logger)).toThrow();
  });

  it("should throw an error if phone number is not a string", () => {
    expect(() => checkPhoneNumber(1234567890, logger)).toThrow();
  });

  it("should throw an error if phone number is not a valid UK phone number", () => {
    expect(() => checkPhoneNumber("+447890123", logger)).toThrow();
  });

  it("should throw an error if phone number starts with 07, it is not supported by AWS", () => {
    expect(() => checkPhoneNumber("07912345678", logger)).toThrow();
  });

  it("should not throw an error if phone number is a valid UK phone number", () => {
    expect(() => checkPhoneNumber("+447912345678", logger)).not.toThrow();
  });
});
