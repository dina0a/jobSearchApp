import { Router } from "express";
import { isHR } from "../../middleware/isHr.js";
import { isOnline } from "../../middleware/isOnline.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addJob, applyJob, deleteJob, getAllJobs, getJobByCompanyName, getJobWithFillter, updateJob } from "./job.controller.js";
import { auth } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validation.js";
import { addJobVal, applyJobVal } from "./job.validate.js";
import upload from "../../utils/resume.js";

const jobRouter = Router()
jobRouter.use(auth)

// addJob
jobRouter.post('/addJob', isOnline, isHR, validate(addJobVal), asyncHandler(addJob))

//updateJob
jobRouter.put('/updateJob', isOnline, isHR, validate(addJobVal), asyncHandler(updateJob))

// deleteJob
jobRouter.delete('/deleteJob/:id', isOnline, isHR, asyncHandler(deleteJob))

// getAllJobs
jobRouter.get('/getAllJobs', isOnline, asyncHandler(getAllJobs))

// getJobByCompanyName
jobRouter.get('/getJobByCompanyName', isOnline, asyncHandler(getJobByCompanyName))

// getJobWithFillter
jobRouter.get('/getJobWithFillter', isOnline, asyncHandler(getJobWithFillter))

// applyJob
jobRouter.post('/applyJob/:jobId', isOnline, upload.single('userResume'), asyncHandler(applyJob))


export default jobRouter