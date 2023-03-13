import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: "eu-west-2" });

export const sendSMS = async (event) => {
  try {
    const { phoneNumber, message } = JSON.parse(event.body);

    const params = {
      MessageBody: JSON.stringify({ phoneNumber, message }),
      QueueUrl: process.env.SQS_QUEUE_URL,
    };

    console.log('Sending SMS request to SQS queue', params);

    await sqs.sendMessage(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'SMS request received',
        input: { phoneNumber, message },
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};