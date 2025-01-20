import express, { Response, NextFunction } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import Order from "../models/order";
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
import { BadRequestError } from "../errors/bad-request-error";
import { JwtPayload } from "jsonwebtoken";
import { orderStatus } from "../helper/order-status";
import { SuccessResponse } from "../helper/success-response";
import Payment, { IPayment } from "../models/payment";
import { RazorpayInstance } from "../services/razorpayinstance";
const router = express.Router();

router.post("/:orderId/checkout", userValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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


            // Allow payment order creation only if status = Awaiting payment
            if (existingOrder.status !== orderStatus.awaitingPayment) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Payment cannot be processed"
                    }
                ]
                next(new BadRequestError("Payment cannot be processed", errors));
                return;
            }


            // Check already payment created or not, with the order_id
            // If already created then send the same order if status = created
            const existingPayment = await Payment.findOne({ order_id: existingOrder._id });
            if (existingPayment) {
                if (existingPayment.status === "pending") {
                    // If created payment is not paid or failed, then return the created payment
                    const response: SuccessResponse = {
                        statusCode: 200,
                        success: true,
                        message: "Payment order already created",
                        order: existingPayment
                    }
                    res.status(200).send(response);
                    return;
                } else {
                    // If Payment paid or failed, then show error
                    const errors: ErrorResponse['errors'] = [
                        {
                            message: "Payment cannot be processed"
                        }
                    ]
                    next(new BadRequestError("Payment cannot be processed", errors));
                    return;
                }
            }


            // If razorpay order not created yet, then create a new order
            // Options for creating payment order
            const options = {
                amount: Number(existingOrder.ticket_price) * 100,
                currency: "INR",
                receipt: String(existingOrder._id)
            };

            // Creating order
            RazorpayInstance.orders.create(options, async function (err, order) {
                if (err) {
                    // Error while creating order in the backend
                    if (err.statusCode === 400) {
                        const message: string = err.error?.description || "Error while creating order";
                        const errors: ErrorResponse["errors"] = [
                            {
                                message: message
                            }
                        ]
                        next(new BadRequestError(message, errors));
                    } else {
                        next(new Error("Error while creating order"));
                    }
                    return;
                } else {
                    // Save created order info to DB
                    const newPayment: IPayment = new Payment({
                        amount: order.amount,
                        attempts: order.attempts,
                        currency: order.currency,
                        rzp_order_id: order.id,
                        order_id: order.receipt
                    })
                    const savedPayment = await newPayment.save();

                    // After creating successful order send order in the response
                    const response: SuccessResponse = {
                        statusCode: 200,
                        success: true,
                        message: "Payment order created",
                        order: savedPayment
                    }
                    res.status(200).send(response);
                    return;
                }
            });
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

export { router as checkoutRouter }