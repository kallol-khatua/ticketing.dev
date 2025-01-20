import express, { CookieOptions, NextFunction, Request, Response } from "express"
import { BadRequestError } from "../errors/bad-request-error";
import { ErrorResponse } from "../errors/custom-error";
import User, { IUser } from "../models/user";
import { PasswordService } from "../services/passwordService";
import { validateSignUpData } from "../helper/signup-request-validation";
const router = express.Router();

router.post("/signup", validateSignUpData,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { firstName, lastName, email, password } = req.body as IUser;

            // Check user with the email already exist or not 
            // If exit then do allow to create an another account 
            // with the same email address
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const errors: ErrorResponse["errors"] = [
                    {
                        message: "Invalid email or password",
                    }
                ]

                return next(new BadRequestError("Invalid email or password", errors));
            }

            // Hashing the password provided by the user
            const passwordService = new PasswordService(Number(process.env.SALT_ROUNDS!));
            let hashedPassword: string;
            try {
                hashedPassword = await passwordService.hashPassword(password);
            } catch (error) {
                return next(error);
            }

            // Creating a new user with firstname, lastname, email and hashed password 
            // and save user to database
            const newUser = new User({ firstName, lastName, email, password: hashedPassword })
            const savedUser = await newUser.save();

            res.status(201).send({ statusCode: 201, success: true, message: "New user created", user: savedUser });
        } catch (error) {
            next(error)
        }
    })

export { router as signupRouter }