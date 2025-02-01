import express, { NextFunction, Response } from "express"
import { AuthenticatedRequest, userValidation } from "../middlewares/user-validation";
import { createTicketRequestValidation } from "../middlewares/create-ticket-request-validation";
import Ticket, { ITicket } from "../models/ticket";
import { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../helper/success-response";
import { sendMessageToKafka } from "../kafka/producer"
import { ErrorResponse } from "../errors/custom-error";
import { InternalServerError } from "../errors/internal-server-error";
import upload from "../middlewares/multer";
import cloudinary from "../config/cloudinary";
import fs from "fs";

const router = express.Router();

router.post("/create", userValidation, upload.single("image"), createTicketRequestValidation,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file!.path, {
                folder: "uploads", // Cloudinary folder name
                use_filename: true,
            });

            // Delete the file locally
            fs.unlinkSync(req.file!.path);

            const {
                title: rawTitle,
                description: rawDescription,
                price,
                location: rawLocation,
                date: rawDate,
                time: rawTime
            } = req.body as ITicket;
            const title = rawTitle?.trim();
            const description = rawDescription?.trim();
            const location = rawLocation?.trim();
            const date = rawDate?.trim();
            const time = rawTime?.trim();

            // Create new ticket
            const user_id: ITicket["user_id"] = (req.user as JwtPayload).user_id;
            const newTicket = new Ticket({ title, description, price, user_id, location, date, time, image: { url: result.url } });
            const savedTicket = await newTicket.save();

            // Add the created ticket to kafka
            await sendMessageToKafka(String(savedTicket._id), JSON.stringify(savedTicket));

            const responseBody: SuccessResponse = {
                statusCode: 201,
                success: true,
                message: "New ticket created",
                newTicket: savedTicket
            };
            res.status(responseBody.statusCode).send(responseBody);
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

export { router as createTicketRouter }