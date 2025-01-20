import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import Ticket from "../models/ticket";
import { ErrorResponse } from "../errors/custom-error";
import { BadRequestError } from "../errors/bad-request-error";
import Order, { IOrder } from "../models/order";
import { orderStatus } from "../helper/order-status";
import { sendMessageToKafka } from "../kafka/producer";
const router = express.Router();

router.post("/create", userValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // If ticket id not present then show bad request error
            const { ticketId }: { ticketId: string } = req.body;
            if (!ticketId) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid ticket"
                    }
                ]
                next(new BadRequestError("Invalid ticket", errors));
                return;
            }


            // Check ticket exist or not, if not exist then show error
            const existingTicket = await Ticket.findById(ticketId);
            if (!existingTicket) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid ticket"
                    }
                ]
                next(new BadRequestError("Invalid ticket", errors));
                return;
            }


            // If ticket has some order id that means it is already reserved or booked
            // then not allow to again create order using the same ticket
            if (existingTicket.order_id) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid ticket"
                    }
                ]
                next(new BadRequestError("Invalid ticket", errors));
                return; 
            }


            // If it is a valid ticket then place order
            const user_id: IOrder["user_id"] = (req.user as JwtPayload).user_id;
            const ticket_id = existingTicket._id;
            const ticket_price = existingTicket.price;
            const status = orderStatus.awaitingPayment;
            const newOrder = new Order({
                user_id,
                ticket_id,
                ticket_price,
                status
            })
            const createdOrder = await newOrder.save();


            // Add order id to the ticket and save the ticket
            existingTicket.order_id = createdOrder._id;
            await existingTicket.save();


            // Add the order to kafka
            await sendMessageToKafka(String(createdOrder._id), JSON.stringify(createdOrder));


            // send order created response
            const responseBody: SuccessResponse = {
                statusCode: 201,
                success: true,
                message: "Order created! Awaiting for payment.",
                newOrder: createdOrder
            };
            res.status(201).send(responseBody);
        } catch (error) {
            console.log("Error while creating order", error)
            next(error);
        }
    })

export { router as createOrderRouter }