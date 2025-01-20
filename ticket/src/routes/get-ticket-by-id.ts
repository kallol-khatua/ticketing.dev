import express, { NextFunction, Response, Request } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import Ticket from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.get("/:ticketId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // If ticket Id not present then show bad request error
        const ticketId: string = req.params.ticketId;
        if (!ticketId) {
            const errors: ErrorResponse["errors"] = [
                {
                    message: "Invalid Ticket ID"
                }
            ]
            next(new BadRequestError("Invalid Ticket ID", errors));
            return;
        }


        // Check ticket exist or not, if not exist then show bad request error
        const existingTicket = await Ticket.findOne({ _id: ticketId })
        if (!existingTicket) {
            const errors: ErrorResponse["errors"] = [
                {
                    message: "Invalid Ticket ID"
                }
            ]
            next(new BadRequestError("Invalid Ticket ID", errors));
            return;
        }

        const responseBody: SuccessResponse = {
            statusCode: 200,
            success: true,
            message: "Ticket found",
            ticket: existingTicket
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

export { router as getTicketByIdRouter }