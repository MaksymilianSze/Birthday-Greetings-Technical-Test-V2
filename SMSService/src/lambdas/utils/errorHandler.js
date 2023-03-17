export function handleError(statusCode, data, errorMessage) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      status: "error",
      data: data,
      errorMessage: errorMessage,
    }),
  };
}
