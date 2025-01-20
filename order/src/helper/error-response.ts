export interface ErrorResponse {
    statusCode: number,
    success: boolean,
    message: string,
    [key: string]: any;
}