class BaseError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

class APIError extends BaseError {
  constructor(message, statusCode = 500, apiName = '', details = null) {
    super(message, statusCode, details);
    this.apiName = apiName;
  }
}

class ValidationError extends BaseError {
  constructor(message, field = '', value = null) {
    super(message, 400, { field, value });
  }
}

class RateLimitError extends BaseError {
  constructor(message = 'Rate limit exceeded', retryAfter = 60) {
    super(message, 429, { retryAfter });
  }
}

class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed', apiName = '') {
    super(message, 401, { apiName });
  }
}

class ConfigurationError extends BaseError {
  constructor(message, missingField = '') {
    super(message, 500, { missingField });
  }
}

module.exports = {
  BaseError,
  APIError,
  ValidationError,
  RateLimitError,
  AuthenticationError,
  ConfigurationError,
};