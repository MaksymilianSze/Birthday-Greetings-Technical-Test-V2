import AWS from "aws-sdk";
import logger from "../utils/logger.js";
import { handleError } from "../utils/errorHandler.js";
import { checkMessage } from "../utils/checkMessage.js";

const sqs = new AWS.SQS();

const phoneRegex = /^(\+44|0)7\d{9}$/; // Change this

export const sendSMS = async (event) => {
  try {
    var { phoneNumber, message } = JSON.parse(event.body); // Don't know how else to do this, const and let don't work because then I can't access it in my catch block return

    // Check if message is longer than 1000 characters
    checkMessage(message, logger);

    // Check if phone number is a valid UK phone number
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return handleError(
        400,
        { phoneNumber, message },
        "Phone number is required and must be a valid UK phone number"
      );
    }

    const params = {
      MessageBody: JSON.stringify({ phoneNumber, message }),
      QueueUrl: process.env.SQS_QUEUE_URL,
    };

    logger.info({
      msg: "Sending SMS request to SQS queue",
      SMSParams: params,
    });

    await sqs.sendMessage(params).promise();

    logger.info("SMS request successfully sent to SQS queue");

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        data: {
          phoneNumber,
          message,
        },
        errorMessage: "SMS request successfully sent to SQS queue",
      }),
    };
  } catch (error) {
    logger.error({
      msg: "Error sending SMS request to SQS queue",
      error: error,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        data: {
          phoneNumber,
          message,
        },
        errorMessage: "Error sending SMS request to SQS queue",
      }),
    };
  }
};