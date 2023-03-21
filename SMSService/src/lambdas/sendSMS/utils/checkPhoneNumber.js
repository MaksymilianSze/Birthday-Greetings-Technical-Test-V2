import { handleError } from "../../utils/handleError.js";

const phoneRegex = /^\+447\d{9}$/;

export function checkPhoneNumber(phoneNumber, logger) {
  logger.info("Checking phone number...");
  if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
    throw handleError(
      400,
      phoneNumber,
      "Phone number is required and must be a valid UK phone number"
    );
  }
  logger.info({ message: "Phone number is valid", phoneNumber: phoneNumber });
  return;
}
