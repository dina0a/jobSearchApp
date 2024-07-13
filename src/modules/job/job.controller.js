import mongoose from "mongoose";
import { Application } from "../../../db/models/application.model.js";
import { Company } from "../../../db/models/company.model.js";
import { Job } from "../../../db/models/job.model.js";
import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

// addJob
export const addJob = async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy } = req.body
    const { userId } = req.user
    // chexk company exist
    const company = await Company.findOne({ companyHR: userId })
    if (!company) {
        next(new Error("company or companyHR not found", 404))
    }
    // Create a new job object
    const newJob = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: userId,
        companyId: company._id
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: 'Job added successfully!', job: newJob });
}

// updateJob
export const updateJob = async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy } = req.body
    const { userId } = req.user
    const updatedCompany = await Job.findOneAndUpdate({ addedBy: userId }, { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy }, { new: true })
    // if company not exist
    if (!updatedCompany) {
        return next(new AppError('you cant update', 401));
    }
    return res.status(200).json({ message: "Job updated successfully", success: true, data: updatedCompany })
}

// deleteJob
export const deleteJob = async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    const jobExist = await Job.findById(id)
    // chexk job exist
    if (!jobExist) {
        return next(new AppError('job not found', 404));
    }
    // permission to delete job
    if (jobExist.addedBy.toString() !== userId) {
        return next(new AppError("you don't have permission to delete job", 401));
    }
    const jobs = await Job.find();
    for (const job of jobs) {
        // Check if there are any applications related to the job
        const applications = await Application.find({ jobId: job._id });
        if (applications.length > 0) {
            // Delete all applications related to the job
            await Application.deleteMany({ jobId: job._id });
            // Delete the job
        }
        await Job.findByIdAndDelete(id);
    }

    return res.status(200).json({ message: "Jobs with related applications deleted successfully", success: true })
}

// getAllJobs
export const getAllJobs = async (req, res, next) => {
    //get job and job's company data
    const job = await Job.find().populate('companyId')

    if (!job) {
        return next(new AppError("job not found"))
    }
    return res.status(200).json({ job, success: true })
}

// getJobByCompanyName
export const getJobByCompanyName = async (req, res, next) => {
    const { search } = req.query
    // get company in the query params
    const company = await Company.findOne({ companyName: search })
    if (!company) {
        return next(new AppError("company not found"))
    }

    // get jobs of specific company
    const job = await Job.find({ companyId: company._id })
    if (!job) {
        return next(new AppError("job not found"))
    }
    return res.status(200).json({ data: job, success: true })
}

// getJobWithFillter
export const getJobWithFillter = async (req, res, next) => {
    // Extract filters from request query
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    // Construct filter object based on provided query parameters
    const filter = {};

    if (workingTime) {
        filter.workingTime = workingTime;
    }

    if (jobLocation) {
        filter.jobLocation = jobLocation;
    }

    if (seniorityLevel) {
        filter.seniorityLevel = seniorityLevel;
    }

    if (jobTitle) {
        filter.jobTitle = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search
    }

    if (technicalSkills) {
        filter.technicalSkills = { $in: technicalSkills.split(',') }; // Assuming technicalSkills is a comma-separated list
    }

    // Execute the query with the constructed filter
    const jobs = await Job.find(filter);

    if (!jobs || jobs.length === 0) {
        return next(new AppError("No jobs found matching the specified filters", 404));
    }

    return res.status(200).json({
        message: "Successfully retrieved filtered jobs",
        success: true,
        data: jobs
    });
}

// applyJob 
export const applyJob = async (req, res, next) => {
    const { userIdd, userTechSkills, userSoftSkills, userResume } = req.body;
    const { userId } = req.user;
    const { jobId } = req.params
    const user = await User.findById(userId)
    if (user.role !== 'user') {
        next(new AppError("you must be user", 401))
    }
    // Check if the user has already applied for this job
    const jobExist = await Application.findOne({ jobId, userId });
    if (jobExist) {
        return next(new AppError("You have already applied for this job", 409));
    }
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new AppError("Job not found", 404));
    }
    // Ensure file is uploaded
    const file = req.file;
    if (!file) {
        return next(new AppError("No file uploaded", 400));
    }
    // Create a new application document
    const application = new Application({
        jobId,
        userId,
        userTechSkills: userTechSkills.split(","),
        userSoftSkills: userSoftSkills.split(","),
        userResume: file.path
    });
    // Save the application to the database
    await application.save();
    return res.status(201).json({
        message: "Application submitted successfully",
        success: true,
        data: application
    });
}