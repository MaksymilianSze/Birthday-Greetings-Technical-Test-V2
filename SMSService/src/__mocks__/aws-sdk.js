export default {
  SQS: jest.fn(() => ({
    sendMessage: jest.fn(() => ({ promise: jest.fn() })),
  })),
};
