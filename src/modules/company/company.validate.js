import joi from "joi";

// addCompany validation schema
export const addCompanyVal = joi.object({
    companyName: joi.string().required().messages({ "any.required": "companyName is required" }),
    description: joi.string().required().messages({ "any.required": "description is required" }),
    industry: joi.string().required().messages({ "any.required": "industry is required" }),
    address: joi.string().required().messages({ "any.required": "address is required" }),
    numberOfEmployees: joi.string().required().messages({ "any.required": "numberOfEmployees is required" }),
    companyEmail: joi.string().email().required().messages({ "any.required": "companyEmail is required" }),
    companyHR: joi.string().required().messages({ "any.required": "companyHR is required" }),

}).required();

// updateCompany validation schema
export const updateCompanyVal = joi.object({
    companyName: joi.string().required().messages({ "any.required": "companyName is required" }),
    description: joi.string().required().messages({ "any.required": "description is required" }),
    industry: joi.string().required().messages({ "any.required": "industry is required" }),
    address: joi.string().required().messages({ "any.required": "address is required" }),
    numberOfEmployees: joi.string().required().messages({ "any.required": "numberOfEmployees is required" }),
    companyEmail: joi.string().email().required().messages({ "any.required": "companyEmail is required" }),
    companyHR: joi.string().required().messages({ "any.required": "companyHR is required" }),

}).required();