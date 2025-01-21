import { Request, Response, NextFunction } from "express"
import { IUser } from "../models/user";
import { ErrorResponse } from "../errors/custom-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateSignInData = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body as IUser;
    const errors: ErrorResponse["errors"] = []

    // if email is not present or length is zero after trim then error
    if (!email || email.trim().length === 0) {
        errors.push({
            message: "A valid email is required",
            field: "email"
        })
    }
    // if password is not present or length is zero after trim then error
    if (!password || password.trim().length === 0) {
        errors.push({
            message: "A valid password is required",
            field: "password"
        })
    }

    if (errors.length > 0) {
        next(new RequestValidationError("Please provide valid data", errors));
    }
    next()
}