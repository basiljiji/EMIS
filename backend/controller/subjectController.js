import Subject from "../models/subjectModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"

export const listSubject = async (req, res, next) => {
    try {
        const subjects = await Subject.find({ 'isDeleted.status': false })
        res.status(200).json(subjects)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const addSubject = async (req, res, next) => {
    try {
        const { subject } = req.body

        const subjectData = await Subject.findOne({ subject })

        if (subjectData) {
            const error = new HttpError("Same Subject Already Exists", 500)
            return next(error)
        } else {
            await Subject.create({
                subject
            })

            res.status(200).json({ message: "Subject Added" })
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const editSubject = async (req, res, next) => {
    try {
        const { subject } = req.body
        const subjectId = req.params.id

        const updatedSubjectDetail = await Subject.findByIdAndUpdate(subjectId, { subject: subject }, { new: true })
        if (updatedSubjectDetail) {
            res.status(200).json({ message: "Subject Updated" })
        } else {
            const error = new HttpError("Subject Not Found", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const deleteSubject = async (req, res, next) => {
    try {
        const subjectId = req.params.id

        const deleteSubjectDetail = await Subject.findById(subjectId)

        if (deleteSubjectDetail) {

            deleteSubjectDetail.isDeleted.status = true
            deleteSubjectDetail.isDeleted.deletedBy = req.admin
            deleteSubjectDetail.isDeleted.deletedTime = Date.now()

            await deleteSubjectDetail.save()
            res.status(200).json({ message: "Subject Deleted" })
        } else {
            const error = new HttpError("Subject Not Found", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}
