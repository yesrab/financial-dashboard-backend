const globalErrorHandler = (error, request, response, next) => {
  return response.status(error.statusCode || 500).json({
    message: "You have triggered the server's global error handler",
    error: error.message,
    status: "Error",
  });
};
module.exports = globalErrorHandler;
