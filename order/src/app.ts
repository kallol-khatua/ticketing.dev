import express, { NextFunction, Request, Response } from 'express';
import { json } from "body-parser";
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { ErrorResponse } from './errors/custom-error';
import { createOrderRouter } from './routes/create';
import { cancelOrderRouter } from './routes/cancel';
import { orderDetailRouter } from './routes/orderDetail';
import { getCreatedOrderRouter } from './routes/get-created-order';

const app = express();
app.use(json());

// Trust the first proxy in the chain
app.set('trust proxy', 1);

app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(`Client IP: ${req.ip}`);
    next()
});

// Create order router
app.use("/v1/api/orders", createOrderRouter);
// Cancel order router
app.use("/v1/api/orders", cancelOrderRouter);
// Order details by order id
app.use("/v1/api/orders", orderDetailRouter);
// Order details by ticket id
// app.use("/v1/api/orders", orderDetailRouter);
// get all order created by a user
app.use("/v1/api/orders", getCreatedOrderRouter);


app.all("*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors: ErrorResponse["errors"] = [
        {
            message: "Route not found"
        }
    ]

    next(new NotFoundError("Route not found", errors));
})

// Error handling middleware
app.use(errorHandler)

export { app }