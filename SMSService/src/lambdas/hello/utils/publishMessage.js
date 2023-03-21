import { handleError } from "../../utils/handleError.js";

export async function publishMessage(sns, snsParams, logger) {
  logger.info("Publishing SMS...");
  await sns
    .publish(snsParams)
    .promise()
    .catch(() => {
      throw handleError(500, {}, "There is an issue with the SNS");
    });
  logger.info({ message: "SMS published successfully", snsParams: snsParams });
  return;
}
