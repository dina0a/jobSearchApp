// import models
import { model, Schema } from "mongoose";

// Schema
const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
        enum: ["onsite", "remotely", "hybrid"],
        required: true
    },
    workingTime: {
        type: String,
        enum: ["part-time", "full-time"],
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
    },
    technicalSkills: [{
        type: String
    }],
    softSkills: [{
        type: String
    }],
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
}, { timestamps: true })

// model 
export const Job = model("Job", jobSchema)