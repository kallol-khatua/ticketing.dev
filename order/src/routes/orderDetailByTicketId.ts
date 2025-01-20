// import express, { NextFunction, Response } from "express"
// import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
// import { SuccessResponse } from "../helper/success-response";
// import { ErrorResponse } from "../errors/custom-error";
// import { BadRequestError } from "../errors/bad-request-error";
// import Order from "../models/order";
// const router = express.Router();

// router.get("/:orderId", userValidation,
//     async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
//         try {
//             // If order id not present then show bad request error
//             const orderId: string = req.params.orderId;
//             if (!orderId) {
//                 const errors: ErrorResponse["errors"] = [
//                     {
//                         message: "Invalid Order ID"
//                     }
//                 ]
//                 next(new BadRequestError("Invalid Order ID", errors));
//                 return;
//             }


//             // Check order exist or not, if not exist then show error
//             const existingOrder = await Order.findOne({ _id: orderId })
//             if (!existingOrder) {
//                 const errors: ErrorResponse["errors"] = [
//                     {
//                         message: "Invalid Order ID"
//                     }
//                 ]
//                 next(new BadRequestError("Invalid Order ID", errors));
//                 return;
//             }

//             // send order created response
//             const responseBody: SuccessResponse = {
//                 statusCode: 200,
//                 success: true,
//                 message: "Order detail found",
//                 order_detail: existingOrder
//             };
//             res.status(responseBody.statusCode).send(responseBody);
//         } catch (error) {
//             console.log("Error while cancelling order", error)
//             next(error);
//         }
//     })

// export { router as orderDetailRouter }