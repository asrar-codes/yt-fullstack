class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
// const errorHandler = (err, req, res, next) => {
//   if (err instanceof ApiError) {
//     return next(err);
//   }
//   return next("This is custom err handling");
// };
export { ApiError };
