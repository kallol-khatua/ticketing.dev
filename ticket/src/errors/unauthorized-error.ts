import { CustomError, ErrorResponse } from "./custom-error";

export class UnauthorizedError extends CustomError {
    constructor(message: string, private errors: ErrorResponse["errors"]) {
        super(message);

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    statusCode = 401;

    serializeErrors(): ErrorResponse {
        return {
            statusCode: this.statusCode,
            success: false,
            message: this.message,
            errors: this.errors
        }
    }
}