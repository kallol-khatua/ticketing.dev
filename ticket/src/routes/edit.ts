import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import Ticket, { ITicket } from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
import { editTicketRequestValidation } from "../middlewares/edit-ticket-request-validation";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.put("/:ticketId/edit", userValidation, editTicketRequestValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
            const existingTicket = await Ticket.findOne({ _id: ticketId, user_id: (req.user as JwtPayload).user_id })
            if (!existingTicket) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid Ticket ID"
                    }
                ]
                next(new BadRequestError("Invalid Ticket ID", errors));
                return;
            }


            // Allow edit only when order id is null with the ticket, that means ticket is not associated with any order
            if (existingTicket.order_id !== null) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Edit not allowed"
                    }
                ]
                next(new BadRequestError("Edit not allowed", errors));
                return;
            }


            // trim title and description
            const { title: rawTitle, description: rawDescription, price } = req.body as ITicket;
            const title = rawTitle?.trim();
            const description = rawDescription?.trim();


            // Update the ticket and save to DB
            // TODO:: include version to maintion order
            existingTicket.title = title;
            existingTicket.description = description;
            existingTicket.price = price;
            const updatedTicket = await existingTicket.save();


            // Add the updated ticket to kafka
            // await sendMessageToKafka(String(savedTicket._id), JSON.stringify(savedTicket));

            const responseBody: SuccessResponse = {
                statusCode: 200,
                success: true,
                message: "Ticket updated",
                updated_ticket: updatedTicket
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

export { router as editTicketRouter }