import { CustomError, ErrorResponse } from "./custom-error";

export class RequestValidationError extends CustomError {
    constructor(message: string, private errors: ErrorResponse["errors"]) {
        super(message);

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    statusCode = 400;

    serializeErrors(): ErrorResponse {
        return {
            statusCode: this.statusCode,
            success: false,
            message: this.message,
            errors: this.errors
        }
    }
}