import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../errors/custom-error';
import { ITicket } from '../models/ticket';
import { RequestValidationError } from '../errors/request-validation-error';

export const createTicketRequestValidation = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ErrorResponse["errors"] = [];
    const { title, description, price } = req.body as ITicket;

    // if title is not present or length is zero after trim then error
    if (!title || title.trim().length === 0) {
        errors.push({
            message: "A valid title is required",
            field: "title"
        })
    }
    // if description is not present or length is zero after trim then error
    if (!description || description.trim().length === 0) {
        errors.push({
            message: "A valid description is required",
            field: "description"
        })
    }
    // if price is less than equal to zero then error
    if (!price || price <= 0) {
        errors.push({
            message: "Valid price is required",
            field: "price"
        })
    }

    if (errors.length > 0) {
        next(new RequestValidationError("Please provide valid data", errors));
    }
    next()
};