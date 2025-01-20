import { CustomError, ErrorResponse } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(message: string, private errors: ErrorResponse["errors"]) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode = 404;

  serializeErrors(): ErrorResponse {
    return {
      statusCode: this.statusCode,
      success: false,
      message: this.message,
      errors: this.errors
    }
  }
}
