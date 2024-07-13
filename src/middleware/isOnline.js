import { User } from "../../db/models/user.model.js"
import { AppError } from "../utils/AppError.js"


export const isOnline = async (req, res, next) => {
    const { userId } = req.user
    const userOnline = await User.findById(userId)
    if(!userOnline){
        next(new AppError("user not found", 401))
    }
    // console.log(userOnline);
    if (userOnline.status !== 'online') {
        next(new AppError("please go to logIn", 401))
    }
    next()
}