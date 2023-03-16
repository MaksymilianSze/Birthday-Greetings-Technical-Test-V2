import AWS from "aws-sdk";
import logger from "../../logger.js";

const sqs = new AWS.SQS();

export const sendSMS = async (event) => {
  try {
    var { phoneNumber, message } = JSON.parse(event.body); // Don't know how else to do this, const and let don't work because then I can't access it in my catch block return

    // Check if message is longer than 1000 characters
    if (!message || message.length > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "error",
          data: {
            phoneNumber,
            message,
          },
          message:
            "Message is required and must be no longer than 1000 characters",
        }),
      };
    }

    // Check if phone number is a valid UK phone number
    const phoneRegex = /^(\+44|0)7\d{9}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "error",
          data: {
            phoneNumber,
            message,
          },
          message:
            "Phone number is required and must be a valid UK phone number",
        }),
      };
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
        message: "SMS request successfully sent to SQS queue",
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
        message: "Error sending SMS request to SQS queue",
      }),
    };
  }
};
