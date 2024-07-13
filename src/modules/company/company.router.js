import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addCompany, applicationSpecificJob, deleteCompany, getApplicationsByCompanyAndDate, getCompanyData, searchCompany, updateCompany } from "./company.controller.js";
import { auth } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validation.js";
import { addCompanyVal, updateCompanyVal } from "./company.validate.js";
import { isHR } from "../../middleware/isHr.js";
import { isOnline } from "../../middleware/isOnline.js";

const companyRouter = Router()
companyRouter.use(auth)

// addCompany
companyRouter.post('/addCompany', isOnline, isHR, validate(addCompanyVal), asyncHandler(addCompany))

// updateCompany
companyRouter.put('/updateCompany', isOnline, isHR, validate(updateCompanyVal), asyncHandler(updateCompany))

// deleteCompany
companyRouter.delete('/deleteCompany/:id', isOnline, isHR, asyncHandler(deleteCompany))

// getCompanyData
companyRouter.get('/getCompanyData/:id', isOnline, isHR, asyncHandler(getCompanyData))

// searchCompany
companyRouter.get('/searchCompany', isOnline, isHR, asyncHandler(searchCompany))

// applicationSpecificJob
companyRouter.get('/applicationSpecificJob/:id', isOnline, isHR, asyncHandler(applicationSpecificJob))

// get company application in excel
companyRouter.get('/:companyId/applications', auth, isHR, asyncHandler(getApplicationsByCompanyAndDate));


export default companyRouter