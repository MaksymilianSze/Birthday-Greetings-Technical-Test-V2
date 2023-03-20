import { handleError } from "../../utils/errorHandler.js";

export function checkMessage(message, logger) {
  // Check if message is longer than 1000 characters
  logger.info("Checking message...");
  if (!message || message.length > 1000) {
    throw handleError(
      400,
      message,
      "Message is required and must be no longer than 1000 characters"
    );
  }
  logger.info("Message is valid");
  return;
}
