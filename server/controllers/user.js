import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password, address } = req.body;

        console.log("got the fields", { firstName, lastName, phone, email, password, address });
        const hasMissingFields = [firstName, lastName, phone, email, password, address].some((item) => item == null || item === "");

        if (hasMissingFields) {
            return res.status(400)
                .json({
                    message: "All fields are required."
                })
        }

        // if all fields are present mode forward.

        // 1. find whether the mail exists.
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404)
                .json({
                    message: "user already exists."
                })
        }

        // 2. if not found then bcrypt the password

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create(
            {
                firstName,
                lastName,
                phone,
                email,
                password: hashedPassword,
                address
            })

        if (newUser) {
            const { password: _, ...safeUser } = newUser.toObject();
            return res.status(201)
                .json({
                    success: true,
                    message: "User Created Successfully.",
                    newUser: safeUser
                })
        }
    } catch (err) {
        console.log(`error while registering the user ${err}`)
        return res.status(500)
            .json({
                success: false,
                message: err.message
            })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hasMissingField = [email, password].some(item => item == null || item === "")


        if (hasMissingField) {
            return res.status(400)
                .json({
                    success: false,
                    message: "all fields are required."
                })
        }

        // bcrypt compare the password if the user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No user found with the email."
                })
        }

        const passwordIsCorrect = await bcrypt.compare(password, existingUser.password);

        if (!passwordIsCorrect) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Incorrect Password."
                })
        }


        // create token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.JWTSECRETKEY,
            {
                expiresIn: "1d"
            }
        );


        return res.status(200)
            .json(
                {
                    success: true,
                    token,
                    message: `Hi, ${existingUser.firstName}`
                }
            )

    } catch (err) {
        return res.status(500)
            .json(
                {
                    success: false,
                    message: `Internal server error ${err.message}`
                }
            )
    }
}