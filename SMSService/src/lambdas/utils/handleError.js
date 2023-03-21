import logger from "./logger";

export function handleError(statusCode, data, errorMessage) {
  logger.error({ message: errorMessage, data: data });
  return {
    statusCode: statusCode ?? 500,
    body: JSON.stringify({
      status: "error",
      data: data ?? {},
      errorMessage: errorMessage ?? "Internal Server Error",
    }),
  };
}
