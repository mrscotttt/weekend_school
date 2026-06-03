export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(503, message);
    this.name = 'ServiceUnavailableError';
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Gateway timeout') {
    super(504, message);
    this.name = 'GatewayTimeoutError';
  }
}
