import jwt from 'jsonwebtoken';
import Teacher from '../models/teacherModel.js';
import Admin from '../models/adminModel.js';
import HttpError from './httpErrorMiddleware.js';


export const authenticateTeacher = async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    console.log(token)

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.teacher = await Teacher.findById(decoded.userId).select('-password');
            next();
        } catch (err) {
            const error = new HttpError("Not Authorized, token failed", 401);
            return next(error);
        }
    } else {
        const error = new HttpError("Not Authorized, No Token", 401);
        return next(error);
    }
};

export const authenticateAdmin = async (req, res, next) => {
    try {
        let token;
        token = req.cookies.jwt;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.admin = await Admin.findById(decoded.userId).select('-password');
                next();
            } catch (err) {
                const error = new HttpError("Not Authorized, token failed", 401);
                return next(error);
            }
        } else {
            const error = new HttpError("Not Authorized, No Token", 401);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong with Login", 500);
        return next(error);
    }

};