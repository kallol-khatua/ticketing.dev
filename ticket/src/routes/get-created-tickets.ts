import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import Ticket from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
const router = express.Router();

router.get("/created-by-user", userValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allTickets = await Ticket.find({ user_id: (req.user as JwtPayload).user_id });

            const responseBody: SuccessResponse = {
                statusCode: 200,
                success: true,
                message: "Tickets found",
                tickets: allTickets
            };
            res.status(responseBody.statusCode).send(responseBody);
        } catch (error) {
            console.error("Error while creating payment order", error);
            const errors: ErrorResponse["errors"] = [
                {
                    message: "Internal server error"
                }
            ]
            next(new InternalServerError("Internal server error", errors))
        }
    })

export { router as getCreatedTicketRouter }