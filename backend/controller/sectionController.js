import Section from "../models/sectionModel.js";
import HttpError from "../utils/httpErrorMiddleware.js";

export const listSection = async (req, res, next) => {
    try {
        const sections = await Section.find({});
        res.status(200).json(sections);
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const addSection = async (req, res, next) => {
    try {
        const { section } = req.body;

        const sectionData = await Section.findOne({ section });

        if (sectionData) {
            const error = new HttpError("Same Section Already Exists", 500);
            return next(error);
        } else {
            await Section.create({
                section
            });

            res.status(200).json({ message: "Section Added" });
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const editSection = async (req, res, next) => {
    try {
        const { section } = req.body;
        const sectionId = req.params.id;

        const updatedSectionDetail = await Section.findByIdAndUpdate(sectionId, { section: section }, { new: true });
        if (updatedSectionDetail) {
            res.status(200).json({ message: "Section Updated" });
        } else {
            const error = new HttpError("Section Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};

export const deleteSection = async (req, res, next) => {
    try {
        const sectionId = req.params.id;

        const deleteSectionDetail = await Section.findByIdAndDelete(sectionId);
        if (deleteSectionDetail) {
            res.status(200).json({ message: "Section Deleted" });
        } else {
            const error = new HttpError("Section Not Found", 404);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500);
        return next(error);
    }
};
