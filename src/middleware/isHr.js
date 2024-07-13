import { User } from "../../db/models/user.model.js"
import { AppError } from "../utils/AppError.js"



export const isHR = async (req, res, next) => {
    const { userId } = req.user
    const userOnline = await User.findById(userId)
    if(!userOnline){
        next(new AppError("user not found", 401))
    }
    if (userOnline.role !== 'companyHR') {
        next(new AppError("you must be companyHR", 401))
    }
    next()
}