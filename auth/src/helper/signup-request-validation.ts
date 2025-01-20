import { Request, Response, NextFunction } from "express"
import { IUser } from "../models/user";
import { ErrorResponse } from "../errors/custom-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateSignUpData = (req: Request, res: Response, next: NextFunction): void => {
    const { firstName, lastName, email, password } = req.body as IUser;
    const errors: ErrorResponse["errors"] = []

    if (errors.length === 0) next();
    else next(new RequestValidationError("Invalid data", errors));
}