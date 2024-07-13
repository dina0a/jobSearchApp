import { AppError } from "./AppError.js"

// export function asyncHandler(fn) {
//     return (req, res, next) => {
//         fn(req, res, next).catch((err) => {
//           return  next(new AppError(err.message, err.statusCode))
//         })
//     }
// }

// export const globalErrorHandler = (err, req, res, next) => {
//     return res.status(err.statusCode || 500).json({ message: err.message, success: false })
// }


export function asyncHandler(fn) {
    return (req,res,next) =>{
        fn(req,res,next).catch(err => {
            return next(new AppError(err.message , err.stausCode))
        })
    }
}


export const globalErrorHandler = (err,req,res,next)=>{
    return res.status(err.statusCode || 500).json({message:err.message , success:false})
}