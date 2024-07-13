import joi from 'joi';

// Signup validation schema
export const signupVal = joi.object({
    firstName: joi.string().required().messages({ "any.required": "First name is required" }),
    lastName: joi.string().required().messages({ "any.required": "Last name is required" }),
    userName: joi.string(),
    email: joi.string().email().required().messages({ "any.required": "Email is required" }),
    recoveryEmail: joi.string().email().required().messages({ "any.required": "Recovery email is required" }),
    password: joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,20}$')).required().messages({
        "any.required": "Password is required",
        "string.pattern.base": "Password must be between 3 and 20 characters and contain only letters and numbers"
    }),
    rePassword: joi.valid(joi.ref('password')).required(),
    DOB: joi.string().required(), // date in format of 2024-12-4
    mobileNumber: joi.string().pattern(/^01[0-9]{9}$/).required().messages({
        'string.pattern.base': 'Phone number must be a valid Egyptian phone number',
        'any.required': 'Phone number is required'
    }),
    role: joi.string().valid("user", 'companyHR').required().messages({ "any.required": "Role (user or companyHR) is required" }),
}).required();

// SignIn validation schema
export const signInVal = joi.object({
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),
    password: joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,20}$')).required().messages({
        "any.required": "Password is required",
        "string.pattern.base": "Password must be between 3 and 20 characters and contain only letters and numbers"
    }),
    mobileNumber: joi.string().pattern(/^01[0-9]{9}$/)
}).required()

// upsdteUser validation schema
export const updateUserVal = joi.object({
    firstName: joi.string().required().messages({ "any.required": "First name is required" }),
    lastName: joi.string().required().messages({ "any.required": "Last name is required" }),
    email: joi.string().email().required().messages({ "any.required": "Email is required" }),
    recoveryEmail: joi.string().email().required().messages({ "any.required": "Recovery email is required" }),
    DOB: joi.string().required(), // date in format of 2024-12-4
    mobileNumber: joi.string().pattern(/^01[0-9]{9}$/).required().messages({
        'string.pattern.base': 'Phone number must be a valid Egyptian phone number',
        'any.required': 'Phone number is required'
    }),
}).required()

// updatePassword
export const updatePasswordVal = joi.object({
    oldPassword: joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,20}$')).required().messages({
        "any.required": "oldPassword is required",
        "string.pattern.base": "Password must be between 3 and 20 characters and contain only letters and numbers"
    }),
    newPassword: joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,20}$')).required().messages({
        "any.required": "newPassword is required",
        "string.pattern.base": "Password must be between 3 and 20 characters and contain only letters and numbers"
    }),
}).required()

// requestPasswordReset
export const requestPasswordResetVal = joi.object({
    email: joi.string().email().required().messages({ "any.required": "Email is required" }),
}).required()

// resetPassword
export const resetPasswordVal = joi.object({
    email: joi.string().email().required().messages({ "any.required": "Email is required" }),
    otp: joi.string().required().messages({ "any.required": "OTP is required" }),
    newPassword: joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,20}$')).required().messages({
        "any.required": "newPassword is required",
        "string.pattern.base": "Password must be between 3 and 20 characters and contain only letters and numbers"
    }),
}).required()

