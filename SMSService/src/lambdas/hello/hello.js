import AWS from "aws-sdk";
import logger from "../utils/logger.js";
import { checkQueueMessage } from "./utils/checkQueueMessage.js";
import { handleError } from "../utils/handleError.js";
import { publishMessage } from "./utils/publishMessage.js";

const sns = new AWS.SNS();

export const hello = async (event) => {
  try {
    const messages = event.Records;

    logger.info({
      msg: "Received messages from SQS queue",
      messages: messages,
    });

    checkQueueMessage(messages, logger);

    const body = JSON.parse(messages[0].body);

    logger.info({ msg: "Parsed the message body", body: body });

    const { phoneNumber, message } = body;

    logger.info({
      msg: "Deconstructed phone number and message",
      body: { phoneNumber: phoneNumber, message: message },
    });

    const snsParams = {
      PhoneNumber: phoneNumber,
      Message: message,
    };

    await publishMessage(sns, snsParams, logger);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        data: {
          phoneNumber,
          message,
        },
        message: "SMS sent",
      }),
    };
  } catch (error) {
    logger.error({
      msg: "Error sending SMS",
      error: error,
    });
    // Not the best way to do this, but I don't know how else to do it
    if (error.statusCode) {
      return error;
    }
    return handleError();
  }
};
