import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import Order from "../models/order";
const router = express.Router();

router.get("/created-by-user", userValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allOrders = await Order.find({ user_id: (req.user as JwtPayload).user_id }).populate("ticket_id");

            // send all orders
            const responseBody: SuccessResponse = {
                statusCode: 200,
                success: true,
                message: "Order found",
                orders: allOrders
            };
            res.status(responseBody.statusCode).send(responseBody);
        } catch (error) {
            console.log("Error while finding all orders created by a user", error)
            next(error);
        }
    })

export { router as getCreatedOrderRouter }