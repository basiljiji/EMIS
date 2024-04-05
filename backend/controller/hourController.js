import Hour from "../models/hourModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"

export const listHour = async (req, res, next) => {
    try {
        const hours = await Hour.find({ 'isDeleted.status': false })
        res.status(200).json(hours)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const addHour = async (req, res, next) => {
    try {
        const { hour } = req.body

        const hourData = await Hour.findOne({ hour, 'isDeleted.status': false })

        if (hourData) {
            const error = new HttpError("Same Hour Already Exists", 500)
            return next(error)
        } else {
            await Hour.create({
                hour
            })

            res.status(200).json({ message: "Hour Added" })
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const editHour = async (req, res, next) => {
    try {
        const { hour } = req.body
        const hourId = req.params.id

        const updatedHourDetail = await Hour.findByIdAndUpdate(hourId, { hour: hour }, { new: true })
        if (updatedHourDetail) {
            res.status(200).json({ message: "Hour Updated" })
        } else {
            const error = new HttpError("Hour Not Found", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const deleteHour = async (req, res, next) => {
    try {
        const hourId = req.params.id

        const hour = await Hour.findOne({ _id: hourId, 'isDeleted.status': false })

        if (!hour) {
            const error = new HttpError("No Hour Found", 500)
            return next(error)
        } else {
            hour.isDeleted.status = true
            hour.isDeleted.deletedBy = req.admin
            hour.isDeleted.deletedTime = Date.now()

            await hour.save()
            res.status(201).json({ message: "Hour Deleted" })
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}
