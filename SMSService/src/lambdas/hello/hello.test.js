import { hello } from "./hello";
import AWS, { setMockResponse } from "../../__mocks__/aws-sdk.js";

const event = {
  Records: [
    {
      messageId: "49c21083-9e1c-4938-a8fc-d2ea2809774c",
      receiptHandle:
        "AQEBruw+YNjyeBXnSIrXLyekT4sGcn7INGtogx4B6wGvM5a6sYQBmYSNcVJIQZEvKbjU0WdVejtUMvyodMeLMi1sgWNTfFoZ969C4XLBRuzkB6LWfrYX5qShPV7ZvxNpqya+TfjZ9/v3qHhlaMUQ+IX8/XI8E4Y1GkAkSHFkSbYG/04XxpcY7i/186sxc0Xw1bzoU+VNtXhGYzG49fS1vsCiVDhmxVqINAWovk19nK0zop5SyAW1YZI60tks5XpY3NjPcksHdy9o7RRFmPcuFn/Itn0cEH+WzOnS+WAFEHwWk5InNz/KjgHeiP78K0ItZ1FVve3z3eIiMo5vrHI+AzWIoASlhbDQpkdSujnPrOAlroQivr0oMaGE7gjnQpkWSRUz0Otiu7gO44wfKXynTZbRbA==",
      body: '{"phoneNumber":"+447922405626","message":"Hello world"}',
      attributes: [Object],
      messageAttributes: {},
      md5OfBody: "88c8394c7dc483b081b845ea58b29d39",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:eu-west-2:533322355632:SMSService-Queue",
      awsRegion: "eu-west-2",
    },
  ],
};

const noMessageEvent = {
  Records: [],
};

describe("hello", () => {
  // Create a mock function for publishMessage
  const publishMessageMock = jest.fn();

  // Mock the SNS object to use the publishMessageMock
  AWS.SNS.prototype.publishMessage = publishMessageMock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns success 200 response if message is sent successfully", async () => {
    setMockResponse(true);
    publishMessageMock.mockReturnValueOnce();

    const response = await hello(event);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("success");
  });

  it("returns error 500 response if there is an issue with SNS", async () => {
    setMockResponse(false);
    publishMessageMock.mockReturnValueOnce();

    const response = await hello(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain("There is an issue with the SNS");
  });

  it("returns error 404 response if there are no messages in the queue", async () => {
    const response = await hello(noMessageEvent);
    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
  });
});
