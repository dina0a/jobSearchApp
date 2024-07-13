import joi from "joi";

// addJob validation schema
export const addJobVal = joi.object({
    jobTitle: joi.string().required().messages({ "any.required": "jobTitle is required" }),
    jobLocation: joi.string().valid("onsite", 'remotely', 'hybrid').required().messages({
        "any.required": "The job location is required and must be either 'onsite', 'remotely', or 'hybrid'.",
        "any.only": "The job location must be one of 'onsite', 'remotely', or 'hybrid'."
    }),
    workingTime: joi.string().valid("part-time", 'full-time').required().messages({
        "any.required": "The working time is required and must be either 'part-time' or 'full-time'.",
        "any.only": "The working time must be one of 'part-time' or 'full-time'."
    }),
    seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required().required().messages({
        "any.required": "The seniority level is required and must be one of 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', or 'CTO'.",
        "any.only": "The seniority level must be one of 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', or 'CTO'."
    }),
    jobDescription: joi.string().required().messages({ "any.required": "jobDescription is required" }),
    technicalSkills: joi.array().items(joi.string()).required().messages({
        "array.base": "Technical skills must be an array",
        "array.includes": "Technical skills must be an array of strings"
    }),
    softSkills: joi.array().items(joi.string()).required().messages({
        "array.base": "Soft skills must be an array",
        "array.includes": "Soft skills must be an array of strings"
    }),
    companyId: joi.string()

}).required();

// applyJob
export const applyJobVal = joi.object({
    jobId: joi.string().required().messages({ "any.required": "jobId is required" }),
    userIdd: joi.string(),
    userTechSkills: joi.array().items(joi.string()).required().messages({
        "array.base": "Technical skills must be an array",
        "array.includes": "Technical skills must be an array of strings"
    }),
    userSoftSkills: joi.array().items(joi.string()).required().messages({
        "array.base": "Technical skills must be an array",
        "array.includes": "Technical skills must be an array of strings"
    }),
    userResume: joi.string().required().messages({ "any.required": "userResume is required" }),
}).required();
