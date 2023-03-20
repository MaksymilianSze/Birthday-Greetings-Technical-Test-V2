import { handleError } from "../../utils/handleError.js";

export async function sendMessage(sns, snsParams, logger) {
  logger.info("Publishing SMS...");
  await sns
    .publish(snsParams)
    .promise()
    .catch(() => {
      throw handleError(500, {}, "There is an issue with the SNS");
    });
  logger.info("SMS published successfully");
  return;
}
