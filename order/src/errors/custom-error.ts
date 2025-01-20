export interface ErrorResponse {
    statusCode: number,
    success: boolean,
    message: string,
    errors: { message: string, field?: string }[]
}

export abstract class CustomError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract statusCode: number;

    abstract serializeErrors(): ErrorResponse;
}