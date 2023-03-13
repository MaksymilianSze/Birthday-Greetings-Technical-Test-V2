import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: "eu-west-2" });
const sns = new AWS.SNS({ region: "eu-west-2" });

export const hello = async (event) => {
  try {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 4, //test
    };

    const { Messages } = await sqs.receiveMessage(params).promise();

    console.log(Messages);
    
    if (!Messages || Messages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No messages in queue' }),
      };
    }

    const { phoneNumber, message } = JSON.parse(Messages[0].Body);

    const snsParams = {
      PhoneNumber: phoneNumber,
      Message: message,
    };


    await sns.publish(snsParams).promise();

    await sqs.deleteMessage({
      QueueUrl: process.env.SQS_QUEUE_URL,
      ReceiptHandle: Messages[0].ReceiptHandle,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'SMS sent',
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