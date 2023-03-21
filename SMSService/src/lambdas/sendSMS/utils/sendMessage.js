import { handleError } from "../../utils/handleError.js";

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

  logger.info({
    message: "SMS request successfully sent to SQS queue",
    SMSParams: params,
  });
  return;
}
