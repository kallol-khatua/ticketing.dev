import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";
import { ErrorResponse } from "../helper/error-response";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.log("Something went wrong", err);
    if (err instanceof CustomError) {
        res.status(err.statusCode).send(err.serializeErrors());
        return;
    }

    const errorResponse: ErrorResponse = {
        statusCode: 400,
        success: false,
        message: "Something went wrong"
    }
    res.status(400).send(errorResponse);
}