import { Router } from "express";
import { deleteAccount, getAccount, getAllAccounts, getAnotherProfile, requestPasswordReset, resetPassword, updatePassword, updateUser } from "./user.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auth } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validation.js";
import { requestPasswordResetVal, resetPasswordVal, updatePasswordVal, updateUserVal } from "./user.validate.js";
import { isOnline } from "../../middleware/isOnline.js";

const userRouter = Router()

userRouter.use(auth)
// updateUser
userRouter.put('/updateUser',isOnline, validate(updateUserVal), asyncHandler(updateUser))

// deleteAccount
userRouter.delete('/deleteAccount',isOnline, asyncHandler(deleteAccount))

// getAccount
userRouter.get('/getAccount',isOnline, asyncHandler(getAccount))

// getAnotherProfile
userRouter.get('/getAnotherProfile',isOnline, asyncHandler(getAnotherProfile))

// updatePassword
userRouter.put('/updatePassword',isOnline, validate(updatePasswordVal), asyncHandler(updatePassword))

// requestPasswordReset
userRouter.post('/requestPasswordReset', validate(requestPasswordResetVal), asyncHandler(requestPasswordReset))

// resetPassword
userRouter.put('/resetPassword', validate(resetPasswordVal), asyncHandler(resetPassword))

// getAllAccounts
userRouter.get('/getAllAccounts',isOnline, asyncHandler(getAllAccounts))


export default userRouter