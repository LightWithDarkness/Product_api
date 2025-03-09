import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { customError } from '../utils/custom.error.js';

const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(customError(400, 'User already exist same email'));
        }
        //saving the user
        const hashedPassword = await bcryptjs.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ success: true, message: "User Created Successfully" });
    } catch (error) {
        return next(error);
    }
};

const signIn = async (req, res, next) => {
    const { email, password: pass } = req.body;
    try {
        // Check if user already exist
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(customError(404, 'User not found'));
        }
        //check password
        const isPasswordValid = await bcryptjs.compare(pass, existingUser.password);
        if (!isPasswordValid) {
            return next(customError(401, 'Invalid Credentials'));
        }
        //generate token
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        const { password, ...user } = existingUser._doc;
        //response
        return res
            .cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
            .status(200)
            .json({ success: true, message: "User Logged In Successfully", user });
    } catch (error) {
        return next(error);
    }
};

const signOut = async (req, res, next) => {

};



export { signUp, signIn, signOut };