import { handleError } from "../../utils/errorHandler.js";

const phoneRegex = /^(\+44|0)7\d{9}$/; // Change this

export function checkPhoneNumber(phoneNumber, logger) {
  logger.info("Checking phone number...");
  if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
    throw handleError(
      400,
      phoneNumber,
      "Phone number is required and must be a valid UK phone number"
    );
  }
  logger.info("Message is valid");
  return;
}
