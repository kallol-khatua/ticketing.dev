import { CustomError, ErrorResponse } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    statusCode = 500;
    reason = "Error connecting to database";

    serializeErrors(): ErrorResponse {
        return {
            statusCode: this.statusCode,
            success: false,
            message: this.message,
            errors: [{ message: "Error connecting to database" }]
        }
    }
}