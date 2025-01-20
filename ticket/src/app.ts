import express, { NextFunction, Request, Response } from 'express';
import { json } from "body-parser";
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { ErrorResponse } from './errors/custom-error';
import { createTicketRouter } from './routes/create';
import { getCreatedTicketRouter } from './routes/get-created-tickets';
import { availableTicketsRouter } from './routes/available-tickets';
import { editTicketRouter } from './routes/edit';
import { getTicketByIdRouter } from './routes/get-ticket-by-id';

const app = express();
app.use(json());

// Trust the first proxy in the chain
app.set('trust proxy', 1);

app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(`Client IP: ${req.ip}`);
    next()
});

// Create ticket router
app.use("/v1/api/tickets", createTicketRouter);
// Get all tickets created by an user
app.use("/v1/api/tickets", getCreatedTicketRouter);
// Get all available tickets
app.use("/v1/api/tickets", availableTicketsRouter);
// Update existing ticket
app.use("/v1/api/tickets", editTicketRouter);
// Get ticket by id
app.use("/v1/api/tickets", getTicketByIdRouter);

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