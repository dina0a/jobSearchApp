// import modules 
import express from 'express'
import { globalErrorHandler } from './src/utils/asyncHandler.js'
import { AppError } from './src/utils/AppError.js'
import { connectDB } from './db/connection.js'
// import userRouter from './src/modules/user/user.router.js'
import authRouter from './src/modules/auth/auth.router.js'
import { User } from './db/models/user.model.js'
import jwt from 'jsonwebtoken'
import userRouter from './src/modules/user/user.router.js'
import companyRouter from './src/modules/company/company.router.js'
import { Company } from './db/models/company.model.js'
import jobRouter from './src/modules/job/job.router.js'

// create server 
const app = express()
const port = 3000

// parse data
app.use(express.json())

// connectDB
connectDB()

// routing
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/job', jobRouter)
app.use('/company', companyRouter)
app.get('/verify/:token', async (req, res, next) => {
    const { token } = req.params
    const payload = jwt.verify(token, 'dinasystem')
    if (payload.email) {
        const updatedUser = await User.findOneAndUpdate({ email: payload.email }, { verifyEmail: true })
        if (!updatedUser) {
            next(new AppError("email not found", 401))
        }
    }
    if (payload.companyEmail) {
        const updatedUser = await Company.findOneAndUpdate({ companyEmail: payload.companyEmail }, { verifyEmail: true })
        if (!updatedUser) {
            next(new AppError("companyEmail not found", 401))
        }
    }
    return res.json({ message: "email verifyed successfully go to login", success: true })
})

// globalError
app.use(globalErrorHandler)

// listen on server
app.listen(port, (() => {
    console.log("server rinning on port...", port);
}))