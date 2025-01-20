import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.log("Something went wrong", err);
    if (err instanceof CustomError) {
        res.status(err.statusCode).send(err.serializeErrors());
        return;
    }

    res.status(400).send({ messsage: err?.message || "Something went wrong" });
}