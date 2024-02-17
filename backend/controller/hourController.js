import Hour from "../models/hourModel.js";
import HttpError from "../utils/httpErrorMiddleware.js";

export const listHour = async (req, res, next) => {
    try {
        const hours = await Hour.find({});
        res.status(200).json(hours);
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const addHour = async (req, res, next) => {
    try {
        const { hour } = req.body;

        const hourData = await Hour.findOne({ hour });

        if (hourData) {
            const error = new HttpError("Same Hour Already Exists", 500);
            return next(error);
        } else {
            await Hour.create({
                hour
            });

            res.status(200).json({ message: "Hour Added" });
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const editHour = async (req, res, next) => {
    try {
        const { hour } = req.body;
        const hourId = req.params.id;

        const updatedHourDetail = await Hour.findByIdAndUpdate(hourId, { hour: hour }, { new: true });
        if (updatedHourDetail) {
            res.status(200).json({ message: "Hour Updated" });
        } else {
            const error = new HttpError("Hour Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const deleteHour = async (req, res, next) => {
    try {
        const hourId = req.params.id;

        const deleteHourDetail = await Hour.findByIdAndDelete(hourId);
        if (deleteHourDetail) {
            res.status(200).json({ message: "Hour Deleted" });
        } else {
            const error = new HttpError("Hour Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};
