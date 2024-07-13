import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import { signInVal, signupVal } from "../user/user.validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { signIn, signup } from "./auth.controller.js";

const authRouter = Router()

authRouter.post('/signup',validate(signupVal),asyncHandler(signup))
authRouter.post('/signIn',validate(signInVal),asyncHandler(signIn))

export default authRouter