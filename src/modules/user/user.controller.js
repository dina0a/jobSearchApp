import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/AppError.js"
import { sendEmail, sendOtpEmail } from "../../utils/sendEmail.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from 'crypto'

// updateUser
export const updateUser = async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName, userName } = req.body
    const { userId, status } = req.user
    // check user exist 
    const userExist = await User.findById(userId)
    if (!userExist) {
        return next(new AppError("user not exist", 401))
    }
    // if old email == new email
    if (email !== userExist.email) {
        const emailExists = await User.findOne({ email });
        await User.updateOne({ _id: userId }, { verifyEmail: false })
        const token = jwt.sign({ email }, process.env.JWT_KEY)
        sendEmail(email, token)
        if (emailExists) {
            return next(new AppError("email already exist", 409))
        }
    }
    // check phone number 
    if (mobileNumber !== userExist.mobileNumber) {
        const mobileExists = await User.findOne({ mobileNumber });
        if (mobileExists) {
            return next(new AppError('Mobile number already exists', 409));
        }
    }
    // update user
    const updateduser = await User.findOneAndUpdate({ _id: userId }, { email, mobileNumber, recoveryEmail, DOB, lastName, firstName, userName: `${firstName} ${lastName}` }, { new: true })

    return res.status(200).json({ message: "user updated successfully", success: true, data: updateduser })
}

// deleteAccount
export const deleteAccount = async (req, res, next) => {
    const { userId } = req.user
    const deletedUser = await User.findOneAndDelete({ _id: userId, status: 'online' });

    // check if user found and status online
    if (!deletedUser) {
        return next(new AppError("User not found or user status is not online", 404));
    }

    return res.status(200).json({ message: "Account deleted successfully", success: true });

}

// getAccount
export const getAccount = async (req, res, next) => {
    const { userId } = req.user
    const getUser = await User.findById(userId)
    getUser.password = undefined
    // check user exist
    if (!getUser) {
        return next(new AppError("account not found", 404))
    }
    // return response
    return res.status(200).json({ message: "successfully", success: true, data: getUser });
}

// getAnotherProfile
export const getAnotherProfile = async (req, res, next) => {
    const { id } = req.query
    // check user exist
    const getUser = await User.findById(id)
    if (!getUser) {
        next(new AppError("user not found", 404))
    }
    // undefined private data
    getUser.recoveryEmail = undefined
    getUser.password = undefined
    getUser.verifyEmail = undefined
    getUser.status = undefined
    getUser.role = undefined
    return res.status(200).json({ message: "successfully", success: true, data: getUser });
}

// updatePassword
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const { userId } = req.user
    const userExist = await User.findById(userId)
    // check oldPassword === password
    const match = bcrypt.compareSync(oldPassword, userExist.password)
    if (!match) {
        next(new AppError("oldPassword not valid", 401))
    }
    // check newPassworrd != oldPassword
    const newmatch = bcrypt.compareSync(newPassword, userExist.password)
    if (newmatch) {
        next(new AppError("enter new password", 401))
    }
    // hashPassword 
    const hashPassword = bcrypt.hashSync(newPassword, 8)
    await User.findOneAndUpdate({ _id: userId }, { password: hashPassword })
    return res.status(200).json({ message: "paswword updated successfully", success: true });
}

// requestPasswordReset
export const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
        next(new AppError("user not found", 401))
    }
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = Date.now() + 10 * 60 * 1000 // OTP expires in 10 minutes
    user.resetPasswordOTP = otp
    user.resetPasswordOTPExpiry = otpExpiry
    await user.save()
    sendOtpEmail(email, otp)
    return res.status(200).json({ message: 'OTP sent successfully', success: true });
}

// resetPassword
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const userExist = await User.findOne({ email })
    // Find user by email
    if (!userExist) {
        next(new AppError("user not found", 401))
    }
    // Validate OTP and check if it is expired
    if (!userExist.resetPasswordOTP || userExist.resetPasswordOTP !== otp || Date.now() > userExist.resetPasswordOTPExpiry) {
        return next(new AppError("Invalid or expired OTP", 401));
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    // Update user's password
    userExist.password = hashedPassword;
    userExist.resetPasswordOTP = undefined;
    userExist.resetPasswordOTPExpiry = undefined;
    await userExist.save();
    return res.status(200).json({ message: "Password updated successfully", success: true });
}

// getAllAccounts
export const getAllAccounts = async (req, res, next) => {
    const { userId } = req.user
    const { recoveryEmail } = req.body
    const getUser = await User.findById(userId)
    // check user exist
    if (!getUser) {
        return next(new AppError("account not found", 404))
    }
    // check status onlind in the middleware
    // if find recoveryEmail
    const emailExists = await User.find({ recoveryEmail })
    if (emailExists.length == 0) {
        return next(new AppError("recoveryEmail not found", 404))
    }
    emailExists.map(ele => ele.password = undefined)
    return res.status(200).json({ message: "successfully", success: true, data: emailExists });
}