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
import { sendPaymentVerificationMessageToKafka } from "../kafka/producer";
const router = express.Router();

router.post("/:orderId/verify-payment", userValidation,
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


            // Allow payment verify only if status = Awaiting payment
            if (existingOrder.status !== orderStatus.awaitingPayment) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Payment cannot be verified"
                    }
                ]
                next(new BadRequestError("Payment cannot be verified", errors));
                return;
            }


            // Check razorpay order created or not, if not created then show error
            const existingPayment = await Payment.findOne({ order_id: existingOrder._id });
            if (!existingPayment) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Razorpay order not created yet"
                    }
                ]
                next(new BadRequestError("Razorpay order not created yet", errors));
                return;
            }


            // If already verified then only send the verified status
            if (existingPayment.status !== "pending") {
                const response: SuccessResponse = {
                    message: "Payment status already verified",
                    statusCode: 200,
                    success: true,
                    order_details: existingOrder
                }
                res.status(200).send(response);
                return;
            }


            // Check status of the order and save status to DB
            RazorpayInstance.orders.fetchPayments(existingPayment.rzp_order_id, async (err, payments) => {
                if (err) {
                    next(new Error("Error while verifying payment status"));
                    return;
                } else {
                    if (payments.count === 0) {
                        // Payment not received yet for the order id
                        const errors: ErrorResponse['errors'] = [
                            {
                                message: "Payment not received yet"
                            }
                        ]
                        next(new BadRequestError("Payment not received yet", errors));
                        return;
                    } else {
                        const paymentItem = payments.items[0];
                        if (paymentItem.status === "captured" && paymentItem.captured === true) {
                            // If payment captured then save success status 
                            existingPayment.rzp_payment_id = paymentItem.id;
                            existingPayment.status = "success";
                            await existingPayment.save();


                            // Change order status to completed
                            existingOrder.status = orderStatus.completed;
                            await existingOrder.save();


                            // Add the completed order to kafka topic
                            await sendPaymentVerificationMessageToKafka(String(existingOrder._id), JSON.stringify(existingOrder));


                            // Send response
                            const response: SuccessResponse = {
                                message: "Payment status verified",
                                statusCode: 200,
                                success: true,
                                order_details: existingOrder
                            }
                            res.status(200).send(response);
                            return;
                        } else if (paymentItem.status === "failed" && paymentItem.captured === false) {
                            // If payment failed then save failed status 
                            existingPayment.rzp_payment_id = paymentItem.id;
                            existingPayment.status = "failed";
                            await existingPayment.save();


                            // Change order status to payment failed 
                            existingOrder.status = orderStatus.paymentFailed;
                            await existingOrder.save();


                            // Add the payment failed order to kafka topic
                            await sendPaymentVerificationMessageToKafka(String(existingOrder._id), JSON.stringify(existingOrder));


                            // Send response
                            const response: SuccessResponse = {
                                message: "Payment status verified",
                                statusCode: 200,
                                success: true,
                                order_details: existingOrder
                            }
                            res.status(200).send(response);
                            return;
                        } else {
                            next(new Error("Error while verifying payment status"));
                            return;
                        }
                    }
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

export { router as verifyPaymentRouter }