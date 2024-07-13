// schema
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: String,
    DOB: {
        type: Date,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "companyHR"],
        required: true
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    verifyEmail: {
        type: Boolean,
        default: false
    }
})

// model 
export const User = model("User", userSchema)

