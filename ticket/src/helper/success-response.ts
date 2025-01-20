export interface SuccessResponse {
    statusCode: number,
    success: boolean,
    message: string,
    [key: string]: any;
}