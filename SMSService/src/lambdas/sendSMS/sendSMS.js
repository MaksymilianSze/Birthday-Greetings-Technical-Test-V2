import AWS from "aws-sdk";
import logger from "../utils/logger.js";
import { handleError } from "../utils/handleError.js";
import { checkMessage } from "./utils/checkMessage.js";
import { checkPhoneNumber } from "./utils/checkPhoneNumber.js";
import { sendMessage } from "./utils/sendMessage.js";

const sqs = new AWS.SQS();

export const sendSMS = async (event) => {
  try {
    const { phoneNumber, message } = JSON.parse(event.body);

    // Check if message is longer than 1000 characters
    checkMessage(message, logger);

    // Check if phone number is a valid UK phone number
    checkPhoneNumber(phoneNumber, logger);

    const params = {
      MessageBody: JSON.stringify({ phoneNumber, message }),
      QueueUrl: process.env.SQS_QUEUE_URL,
    };

    await sendMessage(sqs, params, logger);

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
    // Not the best way to do this, but I don't know how else to do it
    if (error.statusCode) {
      return error;
    }
    return handleError();
  }
};
