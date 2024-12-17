import jwt from "jsonwebtoken"
import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import { decrypt, encrypt } from '../utils/encryptionDecryption.js'
import { sendEmail } from "../utils/NotificationService.js";

const signUp = async (req, res) => {
    try {

        // Check Payload
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: true,
                message: "Confirm password doesn't matches"
            })
        }

        // Check User Exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                error: true,
                message: "User already exists"
            })
        }

        // Hash password and create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({
            email,
            password: hashedPassword,
        })

        // Generate token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: `${process.env.EXPIRY_DAYS}d`
        })

        res.status(201).json({
            error: false,
            message: 'User Registration',
            data: {
                user: newUser,
                accessToken: token,
            },
        })
    }
    catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const signIn = async (req, res) => {
    try {
        // Check Payload
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload"
            })
        }

        // Email & Password authentication
        const user = await User.findOne({ email });
        const isCorrectPassword = await bcrypt.compare(password, user?.password || "")
        if (!user || !isCorrectPassword) {
            return res.status(400).json({
                error: true,
                message: "Email or password invalid."
            })
        }

        // Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: `${process.env.EXPIRY_DAYS}d`
        })
        res.status(200).json({
            data: {
                user,
                accessToken: token
            },
            error: false,
            message: 'Login success'
        })
    }
    catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        // Check Payload
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                error: true,
                message: "Please provide email in payload"
            })
        }

        // Check User exists 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            })
        }

        // Generate Reset Password Token
        const token = encrypt(JSON.stringify({ _id: user._id + '', timestamp: Date.now() }));
        const url = `${process.env.APP_FRONTEND_URL}/${process.env.APP_FORGET_PASSWORD_KEY}/` + token;
        const messagePayload = {
            link: url
        };

        // Email Template
        const body = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #5C218B;">Reset Your Password</h2>
                        <p>We received a request to reset your password. Click the button below to proceed:</p>
                        <a href="${url}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #5C218B; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p>If you didn’t request this, please ignore this email.</p>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This link will expire in 24 hours.</p>
                        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Warm regards,</p>
                        <p style="font-size: 0.9em; color: #666;">Team DigitalFlake</p>
                    </div>`
        const text = `Link is ${url}`
        const subject = 'Reset Password Request'
        const to = user?.email;
        await sendEmail(to, body, text, subject);

        res.status(200).json({
            data: {
                user,
                token,
                messagePayload
            },
            error: false,
            message: 'Forget Password success'
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        // Check Payload
        const { password , token } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                error: true,
                message: "Please provide valid payload."
            });
        }

        // Check Valid Token
        let payload;
        try{
            const decode = decrypt(token);
            payload = decode;
        }
        catch(err){
            throw new Error('Invalid Reset Token')
        }
        payload = JSON.parse(payload)

        // Check token expiration (24 hours)
        const { _id, timestamp } = payload;
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
            console.log("Token expired")
            return res.status(400).json({
                error: true,
                message: "Token has expired."
            });
        }

        // Find user by ID
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        // Hashed Password and Save to DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword;
        await user.save()

        res.status(200).json({
            error: false,
            message: 'Reset Password success'
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

export default {
    signUp,
    signIn,
    forgetPassword,
    resetPassword
}