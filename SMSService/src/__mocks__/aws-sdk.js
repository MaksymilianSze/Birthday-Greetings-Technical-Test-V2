const AWS = jest.createMockFromModule("aws-sdk");

const sendMessageMock = jest.fn();
const publishMessageMock = jest.fn();

class SQS {
  constructor() {
    this.sendMessage = sendMessageMock;
  }
}

class SNS {
  constructor() {
    this.publish = publishMessageMock;
  }
}

AWS.SQS = SQS;
AWS.SNS = SNS;

// This function is used to set whether the sendMessageMock/publishMessage should return a successful or failed promise for testing purposes
export function setMockResponse(success) {
  sendMessageMock.mockReset();
  publishMessageMock.mockReset();
  const returnValue = success
    ? Promise.resolve("Success")
    : Promise.reject(new Error("Failed"));
  sendMessageMock.mockReturnValueOnce({ promise: () => returnValue });
  publishMessageMock.mockReturnValueOnce({ promise: () => returnValue });
}

export default AWS;
