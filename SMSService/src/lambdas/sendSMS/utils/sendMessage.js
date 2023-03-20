import { handleError } from "../../utils/errorHandler";

export async function sendMessage(sqs, params, logger) {
  logger.info({
    msg: "Sending SMS request to SQS queue",
    SMSParams: params,
  });

  await sqs
    .sendMessage(params)
    .promise()
    .catch(() => {
      throw handleError(500, {}, "There is an issue with the SQS queue");
    });

  logger.info("SMS request successfully sent to SQS queue");
  return;
}
