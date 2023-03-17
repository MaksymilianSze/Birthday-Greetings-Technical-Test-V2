export function handleError(statusCode, data, errorMessage) {
  return {
    statusCode: statusCode ?? 500,
    body: JSON.stringify({
      status: "error",
      data: data,
      errorMessage: errorMessage,
    }),
  };
}
