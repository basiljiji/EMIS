import Period from "../models/periodModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"

export const addAccessData = async (req, res, next) => {
    try {
        const { fileUrl, fromTime, toTime, duration } = req.body
        const teacherId = req.teacher

        const calculatedDuration = duration ? duration : toTime - fromTime

        const period = await Period.findOneAndUpdate({
            teacher: teacherId,
            expired: false
        }, {
            $push: {
                accessedFiles: {
                    fileUrl: fileUrl,
                    fromTime: fromTime,
                    toTime: toTime,
                    duration: calculatedDuration
                }
            }
        }, { new: true })

        if (!period) {
            return next(new HttpError("Period not found", 404))
        }

        res.json("Success")
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}


export const getAllPeriods = async (req, res, next) => {
    try {
        const periods = await Period.find({}).populate('teacher').populate('classData.class').populate('classData.section').populate('classData.subject').populate('classData.folder')

        const filteredPeriods = periods.map(period => {
            const filteredAccessedFiles = period.accessedFiles.filter(access => access.duration !== 0)
            return { ...period.toObject(), accessedFiles: filteredAccessedFiles }
        })

        res.json(filteredPeriods)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const addClassData = async (req, res, next) => {
    try {
        const teacher = req.teacher
        const { classId, sectionId, subjectId, folderId } = req.body

        // Validate incoming data
        if (!classId || !sectionId || !subjectId || !folderId) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        // Find the period document for the teacher
        let period = await Period.findOne({ teacher })

        // If no period exists, create a new one
        if (!period) {
            period = new Period({ teacher: req.teacher })
        }

        // Update classData
        period.classData.push({ class: classId, section: sectionId, subject: subjectId, folder: folderId })

        // Save the updated period
        await period.save()

        // Return updated period
        res.status(200).json({ period })
    } catch (err) {
        // Handle errors
        console.error(err)
        const error = new Error("Something Went Wrong")
        error.status = 500
        return next(error)
    }
}