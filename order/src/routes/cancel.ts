import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import { SuccessResponse } from "../helper/success-response";
import { ErrorResponse } from "../errors/custom-error";
import { BadRequestError } from "../errors/bad-request-error";
import Order from "../models/order";
import { orderStatus } from "../helper/order-status";
import { JwtPayload } from "jsonwebtoken";
import { publisherOrderCancellationEvent } from "../kafka/producer";
import Ticket from "../models/ticket";
const router = express.Router();

router.post("/:orderId/cancel", userValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // If order id not present then show bad request error
            const orderId: string = req.params.orderId;
            if (!orderId) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid Order ID"
                    }
                ]
                next(new BadRequestError("Invalid Order ID", errors));
                return;
            }


            // Check order exist or not, if not exist then show error
            const existingOrder = await Order.findOne({ _id: orderId, user_id: (req.user as JwtPayload).user_id })
            if (!existingOrder) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid Order ID"
                    }
                ]
                next(new BadRequestError("Invalid Order ID", errors));
                return;
            }


            // If order status is Awaiting payment only then allow cancel, 
            if (existingOrder.status !== orderStatus.awaitingPayment) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "The order cannot be canceled"
                    }
                ]
                next(new BadRequestError("The order cannot be canceled", errors));
                return;
            }


            // Mark the order as cancelled, 
            existingOrder.status = orderStatus.cancelled;
            await existingOrder.save();

            // Remove order id from the ticket
            await Ticket.findByIdAndUpdate(existingOrder.ticket_id, { order_id: null });

            // and emit the event to kafka
            await publisherOrderCancellationEvent(String(existingOrder._id), JSON.stringify(existingOrder));


            // send order created response
            const responseBody: SuccessResponse = {
                statusCode: 200,
                success: true,
                message: "The order is cancelled",
                order_id: existingOrder._id,
                order_status: existingOrder.status
            };
            res.status(200).send(responseBody);
        } catch (error) {
            console.log("Error while cancelling order", error)
            next(error);
        }
    })

export { router as cancelOrderRouter }