import { CustomError, ErrorResponse } from "./custom-error";

export class BadRequestError extends CustomError {
    constructor(message: string, private errors: ErrorResponse["errors"]) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
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