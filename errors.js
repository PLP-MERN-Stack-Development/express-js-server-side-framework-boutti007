// errors/errors.js
// Custom error classes and a central error-handling middleware

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation Error') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

function errorHandler(err, req, res, next) {
  // If it's an AppError we can send structured info, otherwise hide internals
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode
      }
    });
  } else {
    console.error('Unexpected Error:', err);
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
        status: 500
      }
    });
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  errorHandler
};
