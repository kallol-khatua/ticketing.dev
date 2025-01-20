import express, { NextFunction, Response, Request } from "express"
import Ticket from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
const router = express.Router();

router.get("/available-tickets",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const availableTickets = await Ticket.find({ order_id: null });

            const responseBody: SuccessResponse = {
                statusCode: 200,
                success: true,
                message: "Available tickets found",
                tickets: availableTickets
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

export { router as availableTicketsRouter }