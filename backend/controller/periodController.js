import Period from "../models/periodModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"

export const addAccessData = async (req, res, next) => {
    try {
        const { fileUrl, fromTime, toTime, duration } = req.body
        const teacherId = req.teacher

        console.log(req.body, "period")

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
        const periods = await Period.find({}).populate('teacher')
        res.json(periods)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}