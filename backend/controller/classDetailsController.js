import Class from "../models/classModel.js";
import HttpError from "../utils/httpErrorMiddleware.js";

export const listClass = async (req, res, next) => {
    try {
        const classes = await Class.find({ 'isDeleted.status': false });
        res.status(200).json(classes);
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const addClass = async (req, res, next) => {
    try {
        const { classDetail } = req.body;

        const classData = await Class.findOne({ class: classDetail });

        if (classData) {
            const error = new HttpError("Same Class Already Exists", 500);
            return next(error);
        } else {
            await Class.create({
                class: classDetail
            });

            res.status(200).json({ message: "Class Added" });
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};


export const editClass = async (req, res, next) => {
    try {
        const { classDetail } = req.body;
        const classId = req.params.id;

        const updatedClassDetail = await Class.findByIdAndUpdate(classId, { class: classDetail }, { new: true });
        if (updatedClassDetail) {
            res.status(200).json({ message: "Class Updated" });
        } else {
            const error = new HttpError("Class Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const deleteClass = async (req, res, next) => {
    try {
        const classId = req.params.id;

        const deleteClassDetail = await Class.findById(classId);
        if (deleteClassDetail) {

            deleteClassDetail.isDeleted.status = true
            deleteClassDetail.isDeleted.deletedBy = req.admin
            deleteClassDetail.isDeleted.deletedTime = Date.now()

            await deleteClassDetail.save()

            res.status(200).json({ message: "Class Deleted" });
        } else {
            const error = new HttpError("Class Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

