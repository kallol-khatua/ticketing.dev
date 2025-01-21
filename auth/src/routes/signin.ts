import express, { NextFunction, Request, Response } from "express"
import { BadRequestError } from "../errors/bad-request-error";
import { ErrorResponse } from "../errors/custom-error";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken"
import { PasswordService } from "../services/passwordService";
import { validateSignInData } from "../helper/signin-request-validation";
const router = express.Router();

router.post("/signin", validateSignInData,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // trim data
            const { email: rawEmail, password: rawPassword } = req.body as IUser;
            const email = rawEmail?.trim();
            const password = rawPassword?.trim();

            // Check user with the email already exist or not 
            // If not exit then do allow to signin
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid email or password",
                    }
                ]

                return next(new BadRequestError("Invalid email or password", errors));
            }

            // Check password valid or not
            const passwordService = new PasswordService();
            const isValidPassword = await passwordService.verifyPassword(password, existingUser.password);
            // If password does not match then do not allow to signin
            if (!isValidPassword) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid email or password",
                    }
                ]

                return next(new BadRequestError("Invalid email or password", errors));
            }

            // Generating json web token
            // Payload of the token
            const payload = {
                user_id: existingUser._id,
                user_email: existingUser.email
            }
            // Additional options
            const options = { expiresIn: Number(process.env.JWT_EXPIRY_TIME!) };
            // Secret key for singing the token
            const jwt_secret = process.env.JWT_SECRET!;
            const token = jwt.sign(payload, jwt_secret, options);

            res.status(200).send({ statusCode: 200, success: true, message: "Signin successful", token });
        } catch (error) {
            next(error);
        }
    })

export { router as signinRouter }