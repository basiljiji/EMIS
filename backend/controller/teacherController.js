import Admin from "../models/AdminModel.js";
import Teacher from "../models/TeacherModel.js";
import HttpError from "../utils/httpErrorMiddleware.js";


export const addTeacher = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const adminId = req.admin;

        const validAdmin = await Admin.findOne({ _id: adminId, role: "admin" });

        if (validAdmin) {
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
        } else {
            const error = new HttpError("No Access", 500);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }

};

export const listTeachers = async (req, res, next) => {
    try {
        const adminId = req.admin;

        const validAdmin = await Admin.findOne({ _id: adminId, role: "admin" });

        if (validAdmin) {
            const teachers = await Teacher.find({ 'isDeleted.status': false });
            res.status(200).json(teachers);
        } else {
            const error = new HttpError("No Access", 500);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }
};

export const editTeacher = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const teacherId = req.params.id;

        const adminId = req.admin;

        const validAdmin = await Admin.findOne({ _id: adminId, role: "admin" });

        if (validAdmin) {
            const teacher = await Teacher.findOne({ _id: teacherId, 'isDeleted.status': false });

            if (!teacher) {
                const error = new HttpError("Teacher not found", 404);
                return next(error);
            }

            if (firstName) teacher.firstName = firstName;
            if (lastName) teacher.lastName = lastName;
            if (username) teacher.username = username;
            if (email) teacher.email = email;
            if (password) teacher.password = password;

            await teacher.save();

            res.status(200).json({
                message: "Teacher details updated successfully",
            });
        } else {
            const error = new HttpError("No Access", 500);
            return next(error);
        }
    } catch (err) {
        console.error(err);
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }
};

export const deleteTeacher = async (req, res, next) => {
    try {
        const teacherId = req.params.id;

        const teacher = await Teacher.findOne({ _id: teacherId, 'isDeleted.status': false });

        if (!teacher) {
            const error = new HttpError("No Teacher Found", 500);
            return next(error);
        } else {
            teacher.isDeleted.status = true;
            teacher.isDeleted.deletedBy = req.admin;
            teacher.isDeleted.deletedTime = Date.now();

            await teacher.save();
            res.status(201).json({ message: "Teacher Deleted" });
        }
    } catch (err) {
        const error = new HttpError("Something went wrong", 500);
        return next(error);
    }
};