import { Company } from "../../../db/models/company.model.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/AppError.js"
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../utils/sendEmail.js"
import { Job } from "../../../db/models/job.model.js"
import { Application } from "../../../db/models/application.model.js"
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import excel from 'exceljs';

// addCompany
export const addCompany = async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body
    const companyExist = await Company.findOne({ $or: [{ companyName }, { companyEmail }] })
    // Check if company with companyName or companyEmail already exists
    if (companyExist) {
        next(new AppError("company alredy exist", 409))
    }
    // Check if companyHR exists
    const companyHRExist = await User.findById(companyHR)
    if (!companyHRExist) {
        next(new AppError("companyHR not found", 401))
    }
    // Create and save the new company
    const newCompany = new Company({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR
    });
    await newCompany.save()
    // Generate a JWT token
    const token = jwt.sign({ companyEmail }, "dinasystem");
    // Send email with the token
    sendEmail(companyEmail, token);
    return res.status(201).json({ message: "Company added successfully", success: true, data: newCompany })
}

// updateCompany
export const updateCompany = async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmpolyees, companyEmail } = req.body
    const { userId } = req.user
    const company = await Company.findOne({ companyHR: userId })

    if (!company) {
        return next(new AppError('company is not exists'))
    }
    // Check if the new email already exists for another user if not make emailVerified to false and send sendEmail verification
    if (companyEmail !== company.companyEmail) {
        const emailExists = await Company.findOne({ companyEmail });
        if (emailExists) {
            return next(new AppError('Email already exists', 409));
        }
        await Company.updateOne({ companyHR: userId }, { verifyEmail: false });
        const token = jwt.sign({ companyEmail },process.env.JWT_KEY);
        sendEmail(companyEmail, token);
    }

    // Check if the new company name already exists for another user
    if (companyName && companyName !== company.companyName) {
        const companyExists = await Company.findOne({ companyName });
        if (companyExists) {
            return next(new AppError('company name already exists', 409));
        }
    }
    const updatedCompany = await Company.findOneAndUpdate({ companyHR: userId }, { companyName, description, industry, address, numberOfEmpolyees, companyEmail }, { new: true })

    return res.status(200).json({ message: "user updated successfully", success: true, data: updatedCompany })
}

// deleteCompany
export const deleteCompany = async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    const company = await Company.findOneAndDelete({ companyHR: userId, _id: id })
    if (company) {
        const jobs = await Job.find({ companyId: company._id })
        if (jobs.length > 0) {
            const jobIds = jobs.map(job => job._id);

            // Delete all applications related to the jobs
            await Application.deleteMany({ jobId: { $in: jobIds } });

            // Delete all jobs related to the company
            await Job.deleteMany({ companyId: company._id });
        }
    }
    if (!company) {
        return next(new AppError("company is not found", 404))
    }
    return res.status(200).json({ message: "company deleted successfully with other related jobs and application", success: true })
}

// getCompanyData
export const getCompanyData = async (req, res, next) => {
    const { id } = req.params
    // get company check its existance
    const company = await Company.findOne({ _id: id })
    if (!company) {
        return next(new AppError("company is not found", 404))
    }
    //get the jobs that has the same compant hr id in addedBy 
    const job = await Job.find({ addedBy: company.companyHR })
    if (job.length === 0) {
        return res.status(200).json({ message: 'no jobs for this company', success: true })
    }
    return res.status(200).json({ data: job, success: true })
}

// searchCompany
export const searchCompany = async (req, res, next) => {
    const { name } = req.query;

    // Ensure the name query parameter is provided
    if (!name) {
        return next(new AppError("Name query parameter is required", 400));
    }
    // Search for companies whose names contain the query string (case insensitive)
    const companies = await Company.find({ companyName: { $regex: name, $options: 'i' } });

    if (companies.length === 0) {
        return next(new AppError("No companies found with the provided name", 404));
    }

    return res.status(200).json({ message: "Companies found successfully", success: true, data: companies });

}

// applicationSpecificJob
export const applicationSpecificJob = async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    const job = await Job.findOne({ addedBy: userId, _id: id })
    // chexk if jon exist
    if (!job) {
        return next(new AppError("the job is not found", 404))
    }

    const applications = await Application.find({ jobId: job._id }).populate('userId')
    // check app in the sjob
    if (applications.length === 0) {
        return res.status(200).json({ message: 'no applications for this job', success: true })
    }
    return res.status(200).json({ data: applications, success: true })
}

// Resolve __dirname correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getApplicationsByCompanyAndDate = async (req, res, next) => {
    const { companyId } = req.params;
    const { date } = req.query;

    // Construct date range for the query
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch applications for the company on the specified date
    const applications = await Application.find({
        jobId: { $in: await Job.find({ companyId }, '_id') },
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'username email'); // Populate user details

    if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for the specified date', success: false });
    }

    // Create Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Tech Skills', key: 'techSkills', width: 40 },
        { header: 'Soft Skills', key: 'softSkills', width: 40 },
        { header: 'Resume URL', key: 'resumeURL', width: 50 },
        { header: 'Submission Date', key: 'createdAt', width: 20 }
    ];

    // Populate rows with application data
    applications.forEach(application => {
        worksheet.addRow({
            email: application.userId.email,
            jobTitle: application.jobId.jobTitle,
            techSkills: application.userTechSkills.join(', '),
            softSkills: application.userSoftSkills.join(', '),
            resumeURL: application.userResume,
            createdAt: application.createdAt.toLocaleString()
        });
    });

    // Generate Excel file
    const fileName = `applications_${companyId}_${date.replace(/-/g, '_')}.xlsx`;
    const filePath = path.join(__dirname, '..', '..', 'excelsheets', fileName);

    try {
        // Ensure the excelsheets directory exists
        const excelsheetsDir = path.join(__dirname, '..', '..', 'excelsheets');
        if (!fs.existsSync(excelsheetsDir)) {
            fs.mkdirSync(excelsheetsDir, { recursive: true });
        }

        // Write the Excel file
        await workbook.xlsx.writeFile(filePath);

        // Send success response
        res.status(200).json({ message: 'Excel file generated successfully', success: true, filePath });
    } catch (error) {
        console.error('Error generating Excel:', error);
        return res.status(500).json({ message: 'Failed to generate Excel file', success: false });
    }

};