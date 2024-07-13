// import models
import { model, Schema } from "mongoose";

// Schema
const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,

    },
    address: {
        type: String,
        required: true,
    },
    numberOfEmployees: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Regular expression to match "num-num" format
                const regex = /^\d+-\d+$/;
                return regex.test(value);
            },
            message: props => `${props.value} is not a valid employee range! It should be in the format "num-num".`
        }
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    verifyEmail: {
        type: Boolean,
        default: false
    }
})

// model 
export const Company = model("Company", companySchema)