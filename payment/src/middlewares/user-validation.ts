import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { ErrorResponse } from '../errors/custom-error';
import { ForbiddenError } from '../errors/forbidded-error';

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; // Attach user info to the request object
}

export const userValidation = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // If authorization header not present or not start with 'Bearer ' then should return 401 UnauthorizedError
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const errors: ErrorResponse["errors"] = [
            {
                message: "Access Denied. No token provided."
            }
        ]
        next(new UnauthorizedError("Access Denied. No token provided.", errors));
        return;
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    // If no token present in the header then should return 401 UnauthorizedError
    if (!token) {
        const errors: ErrorResponse["errors"] = [
            {
                message: "Access Denied. Invalid token format."
            }
        ]
        next(new UnauthorizedError("Access Denied. Invalid token format.", errors));
        return;
    }

    try {
        const secretKey: string = process.env.JWT_SECRET!;
        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        // Validate decoded data it should contain user_id, user_email

        // Attach decoded token payload to the request
        req.user = decoded;
        next();
    } catch (err) {
        // If token is invalid or expired then should return 403 ForbiddenError
        const errors: ErrorResponse["errors"] = [
            {
                message: "Invalid or expired token."
            }
        ]
        next(new ForbiddenError("Invalid or expired token.", errors));
        return;
    }
};