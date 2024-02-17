import Teacher from "../models/TeacherModel.js";
import HttpError from "../utils/httpErrorMiddleware.js";


export const addTeacher = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const teacherExists = await Teacher.findOne({ email });

        if (teacherExists) {
            res.status(400);
            const error = new HttpError("Teacher Already Exists", 400);
            return next(error);
        }

        const teacher = await Teacher.create({
            firstName,
            lastName,
            username,
            email,
            password,
        });

        if (teacher) {
            res.status(201).json({
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400);
            const error = new HttpError("Invalid user data", 400);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }

};