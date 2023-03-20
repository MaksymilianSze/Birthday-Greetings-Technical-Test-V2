import { handleError } from "../../utils/errorHandler.js";

export function checkQueueMessage(messages, logger) {
  logger.info("Checking message queue...");
  if (!messages || messages.length === 0) {
    throw handleError(404, {}, "Couldn't find any messages in the queue");
  }
  logger.info("Message queue found");
  return;
}