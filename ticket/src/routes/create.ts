import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import { createTicketRequestValidation } from "../middlewares/create-ticket-request-validation";
import Ticket, { ITicket } from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { sendMessageToKafka } from "../kafka/producer"
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
const router = express.Router();

router.post("/create", userValidation, createTicketRequestValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // trim title and description
            const { title: rawTitle, description: rawDescription, price } = req.body as ITicket;
            const title = rawTitle?.trim();
            const description = rawDescription?.trim();

            // Create new ticket
            const user_id: ITicket["user_id"] = (req.user as JwtPayload).user_id;
            const newTicket = new Ticket({ title, description, price, user_id });
            const savedTicket = await newTicket.save();

            // Add the created ticket to kafka
            await sendMessageToKafka(String(savedTicket._id), JSON.stringify(savedTicket));

            const responseBody: SuccessResponse = {
                statusCode: 201,
                success: true,
                message: "New ticket created",
                newTicket: savedTicket
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

export { router as createTicketRouter }