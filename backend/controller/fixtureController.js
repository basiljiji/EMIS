import Teacher from "../models/teacherModel.js"
import Fixture from "../models/fixtureModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"


export const addFixture = async (req, res, next) => {
    try {

        const { section, classdata, subject, hour } = req.body
        const teacherId = req.teacher

        const teacherData = await Teacher.findById(teacherId)

        if (!teacherData) {
            const error = new HttpError("No Teacher Found", 500)
            return next(error)
        } else {

            const today = new Date().toISOString().substring(0, 10)

            const hourdata = await Fixture.findOne({ teacher: teacherId, hour: hour, date: today })
            if (hourdata) {
                const error = new HttpError("Already Class Assigned", 500)
                return next(error)
            } else {
                await Fixture.create({
                    subject,
                    section,
                    class: classdata,
                    hour,
                    teacher: teacherId
                })
                res.status(200).json({ message: "Fixture Added" })
            }
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}


export const listFixtures = async (req, res, next) => {
    try {

        const teacherid = req.teacher

        const today = new Date().toISOString().substring(0, 10)

        const fixtures = await Fixture.find({ teacher: teacherid, 'isDeleted.status': false, date: today }).populate('class', 'class').populate('subject', 'subject').populate('section', 'section').populate('hour', 'hour')
        res.status(200).json(fixtures)

    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const viewSingleFixture = async (req, res, next) => {
    try {
        const fixtureId = req.params.id

        const teacherId = req.teacher

        const fixture = await Fixture.findOne({ teacher: teacherId, _id: fixtureId }).populate('class', 'class').populate('subject', 'subject').populate('section', 'section').populate('hour', 'hour')

        if (!fixture) {
            const error = new HttpError("No Fixture Found", 500)
            return next(error)
        } else {
            res.status(200).json({ fixture })
        }

    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}


export const editFixture = async (req, res, next) => {
    try {
        const { classdata, section, subject, hour } = req.body
        const fixtureId = req.params.id

        const teacherId = req.teacher

        const today = new Date().toISOString().substring(0, 10)

        const fixture = await Fixture.findOne({ teacher: teacherId, _id: fixtureId, date: today, 'isDeleted.status': false })

        if (!fixture) {
            const error = new HttpError("No Fixture Found", 500)
            return next(error)
        } else {
            if (classdata) fixture.class = classdata
            if (section) fixture.section = subject
            if (subject) fixture.subject = subject
            if (hour) fixture.hour = hour

            await fixture.save()
            res.status(200).json({ message: "Fixture Edited" })
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const deleteFixture = async (req, res, next) => {
    try {

        const teacherId = req.teacher

        const fixtureId = req.params.id

        const today = new Date().toISOString().substring(0, 10)

        const fixture = await Fixture.findOne({ teacher: teacherId, _id: fixtureId, date: today })

        if (!fixture) {

            const error = new HttpError("No Fixture Found", 500)
            return next(error)

        } else {
            fixture.isDeleted.status = true
            fixture.isDeleted.deletedBy = req.teacher
            fixture.isDeleted.deletedTime = Date.now()

            await fixture.save()
            res.status(201).json({ message: "Fixture Deleted" })
        }

    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}