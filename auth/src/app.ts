import express, { NextFunction, Request, Response } from 'express';
import { json } from "body-parser";
import { errorHandler } from './middlewares/error-handler';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { NotFoundError } from './errors/not-found-error';
import { ErrorResponse } from './errors/custom-error';

const app = express();
app.use(json());

// Trust the first proxy in the chain
app.set('trust proxy', 1);

app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(`Client IP: ${req.ip}`);
    next()
});

// Signup router
app.use("/v1/api/user", signupRouter);
app.use("/v1/api/user", signinRouter);

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