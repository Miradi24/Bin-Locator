import passport from "passport";
import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";

export function login(req: Request, res: Response) {
    passport.authenticate('local', (err: Error, user: IUser, info: { message: string }) => {
        // If an error occurred during authentication, or if no user was found return a 500 status code with an error message.
        if (err || !user) {
            return res.status(500).json({
                msg: info.message || 'Authentication failed',
                error: err
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({
                    msg: 'Login failed',
                    error: err.message
                });
            }

            // If login is successful, return the user information
            return res.status(200).json({
                user: {
                    id: user._id,
                    email: user.email,
                }
            });
        });
    })(req, res);
}

export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Ensure email and password are not empty
        if (!email || !password) {
            return res.status(400).json({
                msg: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: 'Email already exists' });
        }

        const user = new User({ email });
        const newUser = await User.register(user, password);

        req.logIn(newUser, (err) => {
            if (err) {
                return res.status(500).json({
                    msg: 'Regestration successful but login failed',
                    error: err.message
                });
            }

            return res.status(201).json({
                user: {
                    id: newUser._id,
                    email: newUser.email,
                }
            });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Oops something went wrong', error });
    }
}