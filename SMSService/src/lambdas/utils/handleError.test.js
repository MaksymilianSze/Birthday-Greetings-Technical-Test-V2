import { handleError } from "./handleError.js";

describe("handleError", () => {
  it("should return default error message and status code 500", () => {
    const result = handleError();
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      status: "error",
      data: {},
      errorMessage: "Internal Server Error",
    });
  });

  it("should return custom error message and status code 400", () => {
    const result = handleError(400, { key: "value" }, "Invalid input");
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      status: "error",
      data: { key: "value" },
      errorMessage: "Invalid input",
    });
  });

  it("should return default error message with empty data", () => {
    const result = handleError(404);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      status: "error",
      data: {},
      errorMessage: "Internal Server Error",
    });
  });

  it("should return custom error message with empty data", () => {
    const result = handleError(401, null, "Unauthorized");
    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({
      status: "error",
      data: {},
      errorMessage: "Unauthorized",
    });
  });
});
