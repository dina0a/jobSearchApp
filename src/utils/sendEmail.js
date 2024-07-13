import nodemailer from "nodemailer";
import { htmlTemplate } from "./htmlTemplate.js";
import { AppError } from "./AppError.js";

export const sendEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_GMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"dina system" <${process.env.EMAIL_GMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: htmlTemplate(token), // html body
    });

    // console.log("Message sent: %s", info.messageId);
}

export const sendOtpEmail = (email,otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_GMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_GMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return next(new AppError("Failed to send OTP", 500));
        }
        return res.status(200).json({ message: 'OTP sent successfully', success: true });
    });
}