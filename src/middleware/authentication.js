import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'

export const auth = (req, res, next) => {
    const { authorization } = req.headers
    const [key, token] = authorization.split(' '[0])
    if (key !== 'bearer') {
        next(new AppError("invalid bearer key", 401))
    }
    const payload = jwt.verify(token, process.env.JWT_KEY)
    req.user = payload
    next()
}
