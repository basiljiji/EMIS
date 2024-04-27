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


export const getAllPeriodsReport = async (req, res, next) => {
    try {
        const periods = await Period.find({})
            .populate("teacher")
            .populate("classData.class")
            .populate("classData.section")
            .populate("classData.subject")
            .populate("classData.folder")

        const teacherData = {}

        periods.forEach((period) => {
            const {
                teacher,
                loggedIn,
                loggedOut,
                accessedFiles,
                createdAt,
            } = period

            const teacherName = `${teacher.firstName} ${teacher.lastName}`

            if (!teacherData[teacherName]) {
                teacherData[teacherName] = {
                    totalDuration: 0,
                    totalLoggedInTime: 0,
                    totalResourceTime: 0,
                    fromDate: createdAt,
                    toDate: createdAt,
                }
            }

            // Update fromDate and toDate based on createdAt
            const currentFromDate = new Date(teacherData[teacherName].fromDate)
            const currentToDate = new Date(teacherData[teacherName].toDate)
            const periodCreatedAt = new Date(createdAt)

            if (periodCreatedAt < currentFromDate) {
                teacherData[teacherName].fromDate = periodCreatedAt
            } else if (periodCreatedAt > currentToDate) {
                teacherData[teacherName].toDate = periodCreatedAt
            }

            const totalDuration = calculateTotalDuration(accessedFiles)
            teacherData[teacherName].totalDuration += totalDuration

            const totalLoggedInTime = calculateTotalLoggedInTime(loggedIn, loggedOut)
            teacherData[teacherName].totalLoggedInTime += totalLoggedInTime

            const totalResourceTime = calculateTotalResourceTime(accessedFiles)
            teacherData[teacherName].totalResourceTime += totalResourceTime
        })

        // Format durations to hh:mm format
        for (const teacherName in teacherData) {
            const { totalDuration, totalLoggedInTime, totalResourceTime } =
                teacherData[teacherName]

            teacherData[teacherName].totalDuration = formatHoursMinutes(totalDuration)
            teacherData[teacherName].totalLoggedInTime = formatHoursMinutes(
                totalLoggedInTime
            )
            teacherData[teacherName].totalResourceTime = formatHoursMinutes(
                totalResourceTime
            )
        }

        res.json(teacherData)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

// Function to calculate total duration in minutes from accessedFiles
const calculateTotalDuration = (accessedFiles) => {
    return accessedFiles.reduce((totalDuration, file) => {
        return totalDuration + file.duration
    }, 0) / 60000 // Convert total duration to minutes
}

// Function to calculate total logged-in time in minutes
const calculateTotalLoggedInTime = (loggedIn, loggedOut) => {
    const loggedInTime = new Date(loggedIn)
    const loggedOutTime = new Date(loggedOut)
    const timeDifference = loggedOutTime - loggedInTime // Difference in milliseconds
    return timeDifference / (1000 * 60) // Convert difference to minutes
}

// Function to calculate total resource time in minutes from accessedFiles
const calculateTotalResourceTime = (accessedFiles) => {
    return accessedFiles.reduce((totalTime, file) => {
        const fromTime = new Date(file.fromTime)
        const toTime = new Date(file.toTime)
        const timeDifference = toTime - fromTime // Difference in milliseconds
        return totalTime + (timeDifference / (1000 * 60)) // Convert difference to minutes
    }, 0)
}

// Function to format duration in hours and minutes (hh:mm)
const formatHoursMinutes = (duration) => {
    const hours = Math.floor(duration / 60)
    const minutes = Math.round(duration % 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export const getPeriodsByTeacher = async (req, res, next) => {
    try {
        const teacherId = req.params.id

        const periods = await Period.find({ teacher: teacherId }).populate('teacher').populate('classData.class').populate('classData.section').populate('classData.subject').populate('classData.folder')

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
        let period = await Period.findOne({
            teacher, expired: false
        })

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