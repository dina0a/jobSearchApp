// import models
import { model, Schema } from "mongoose";

// Schema
const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    userTechSkills: [{
        type: String
    }],
    userSoftSkills: [{
        type: String
    }],
    userResume: {
        type: String  // Store Cloudinary URL of the PDF
    },
}, { timestamps: true })

// model 
export const Application = model("Application", applicationSchema)