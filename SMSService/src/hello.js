import AWS from "aws-sdk";
import logger from "./logger.js";

const sns = new AWS.SNS();

export const hello = async (event) => {
  try {
    const messages = event.Records;

    logger.info({
      msg: "Received messages from SQS queue",
      messages: messages,
    });

    if (!messages || messages.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: "success",
          data: {
            phoneNumber,
            message,
          },
          message: "Couldn't find any messages in the queue",
        }),
      };
    }

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

    logger.info("Publishing SMS...");
    await sns.publish(snsParams).promise();
    logger.info("SMS published successfully");

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
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        data: {
          phoneNumber,
          message,
        },
        message: "Error sending SMS",
      }),
    };
  }
};
