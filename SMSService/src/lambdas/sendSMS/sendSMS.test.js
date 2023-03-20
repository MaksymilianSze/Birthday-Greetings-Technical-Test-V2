import { sendSMS } from "./sendSMS.js";
import AWS, { setMockResponse } from "../../__mocks__/aws-sdk.js";

const event = {
  body: JSON.stringify({
    phoneNumber: "+447922405626",
    message: "Hello world",
  }),
};

const invalidMessageEvent = {
  body: JSON.stringify({
    phoneNumber: "+447922405626",
    message: "a".repeat(1001),
  }),
};

const invalidPhoneEvent = {
  body: JSON.stringify({
    phoneNumber: "+47922426",
    message: "test",
  }),
};

describe("sendSMS", () => {
  // Create a mock function for sendMessage
  const sendMessageMock = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns success 200 response if message and phone number are valid", async () => {
    // Set the sendMessageMock to return a successful promise
    setMockResponse(true);
    sendMessageMock.mockReturnValueOnce();

    const response = await sendSMS(event);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("success");
  });

  it("returns error 500 response if there is an issue with the SQS", async () => {
    setMockResponse(false);
    sendMessageMock.mockReturnValueOnce();

    const response = await sendSMS(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain("There is an issue with the SQS queue");
  });

  it("returns error 400 response if message is too long", async () => {
    const response = await sendSMS(invalidMessageEvent);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain(
      "Message is required and must be no longer than 1000 characters"
    );
  });

  it("returns error response if phone number is invalid", async () => {
    const response = await sendSMS(invalidPhoneEvent);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain(
      "Phone number is required and must be a valid UK phone number"
    );
  });
});
