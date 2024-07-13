import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/AppError.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../utils/sendEmail.js"

// signup
export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role, status } = req.body;

    // Check if the user already exists
    const userExist = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (userExist) {
        return next(new AppError("User already exists", 401));
    }

    // Hash the password
    const hashPassword = bcrypt.hashSync(password, 8);

    // Create the user
    const user = new User({
        firstName,
        lastName,
        userName: `${firstName} ${lastName}`,
        email,
        password: hashPassword,
        recoveryEmail,
        DOB,
        mobileNumber,
        role,
    });

    const createdUser = await user.save(); // save user in db
    createdUser.password = undefined; // Remove password from the response
    // Generate a JWT token
    const token = jwt.sign({ email }, process.env.JWT_KEY);

    // Send email with the token
    sendEmail(email, token);

    return res.status(201).json({ message: "User created successfully", success: true, data: createdUser });
};

// signIn
export const signIn = async (req, res, next) => {
    const { email, password, recoveryEmail, mobileNumber } = req.body

    // check if userExist
    const userExist = await User.findOne({ $or: [{ email }, { mobileNumber }, { recoveryEmail }] })

    if (!userExist) {
        return next(new AppError("invalid credentials", 401))
    }
    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordValid) {
        return next(new AppError("Invalid credentials", 401));
    }
    // verifyEmail
    if (userExist.verifyEmail === false) {
        return next(new AppError("verifyed your email", 401))
    }
    // generate token
    const accesstoken = jwt.sign({ userId: userExist._id, email: userExist.email, mobileNumber: userExist.mobileNumber, recoveryEmail: userExist.recoveryEmail, status: userExist.status }, process.env.JWT_KEY)
    // update status
    const updatedUser = await User.findOneAndUpdate({ $or: [{ email }, { mobileNumber }, { recoveryEmail }] }, { status: 'online' }, { new: true })
    updatedUser.password = undefined
    return res.status(200).json({ message: "User login successfully", success: true, data: updatedUser, token: accesstoken });
}

