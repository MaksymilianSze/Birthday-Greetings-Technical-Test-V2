import { sendSMS } from "./sendSMS.js";
import AWS from "./__mocks__/aws-sdk.js";

describe("sendSMS", () => {
  it("returns success response if message and phone number are valid", async () => {
    const event = {
      body: JSON.stringify({
        phoneNumber: "+447922405626",
        message: "Hello world",
      }),
    };

    const response = await sendSMS(event);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("success");
  });

  it("returns error response if message is too long", async () => {
    const event = {
      body: JSON.stringify({
        phoneNumber: "+447922405626",
        message: "a".repeat(1001),
      }),
    };

    const response = await sendSMS(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain(
      "Message is required and must be no longer than 1000 characters"
    );
  });

  it("returns error response if phone number is invalid", async () => {
    const event = {
      body: JSON.stringify({
        phoneNumber: "+47922426",
        message: "test",
      }),
    };

    const response = await sendSMS(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toContain("error");
    expect(response.body).toContain(
      "Phone number is required and must be a valid UK phone number"
    );
  });
});
