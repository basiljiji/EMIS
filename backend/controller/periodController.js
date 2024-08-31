import Period from "../models/periodModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import moment from 'moment' // Import moment.js for date manipulation

export const addAccessData = async (req, res, next) => {
    try {
        const { fileUrl, fromTime, toTime, duration } = req.body
        const teacherId = req.teacher

        const calculatedDuration = duration ? duration : toTime - fromTime

        const portionTitle = fileUrl.split('/').pop();

        const period = await Period.findOneAndUpdate({
            teacher: teacherId,
            expired: false
        }, {
            $push: {
                accessedFiles: {
                    portionTitle: portionTitle,
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

export const getAllPeriodsChart = async (req, res, next) => {
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


export const getAllPeriods = async (req, res, next) => {
    try {
        const { pageNumber = 1, startDate, endDate, teacherId } = req.query
        const pageSize = 50
        const query = {}

        if (startDate && endDate) {
            query.day = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        if (teacherId) {
            query.teacher = teacherId
        }

        const count = await Period.countDocuments(query)
        let periods = await Period.find(query)
            .populate('teacher')
            .populate('classData.class')
            .populate('classData.section')
            .populate('classData.subject')
            .populate('classData.folder')
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)

        // Initialize totals
        let totalLoginTimeSum = 0
        let totalDurationSum = 0
        let totalResourceTimeSum = 0

        periods = periods.map(period => {
            // Combine duplicate class entries
            const uniqueClasses = {}
            period.classData.forEach(data => {
                const classKey = `${data.class._id}-${data.section._id}-${data.subject._id}`
                if (!uniqueClasses[classKey]) {
                    uniqueClasses[classKey] = { ...data.toObject() }
                } else {
                    // If duplicate, you can aggregate or merge additional properties here
                }
            })

            period.classData = Object.values(uniqueClasses)

            // Combine duplicate accessedFiles entries
            const fileMap = {}
            let totalDuration = 0
            let totalResourceTime = 0
            period.accessedFiles.forEach(file => {
                const fileId = file.fileId // Assuming fileId is a unique identifier for files
                if (!fileMap[fileId]) {
                    fileMap[fileId] = { ...file.toObject() }
                } else {
                    // Aggregate durations and resource times
                    fileMap[fileId].duration += file.duration
                    if (file.fromTime && file.toTime) {
                        const fromTime = new Date(file.fromTime)
                        const toTime = new Date(file.toTime)
                        fileMap[fileId].resourceTime += (toTime - fromTime) / 60000
                    }
                }
            })

            period.accessedFiles = Object.values(fileMap)

            // Calculate total login time
            const loggedOutTime = period.loggedOut || period.updatedAt
            const loginTime = period.loggedIn ? new Date(period.loggedIn) : new Date()
            const logoutTime = new Date(loggedOutTime)
            const totalLoginTime = (logoutTime - loginTime) / 60000 // Duration in minutes

            // Add to overall sums
            totalLoginTimeSum += totalLoginTime
            totalDurationSum += totalDuration
            totalResourceTimeSum += totalResourceTime

            // Add totals to the period object
            return {
                ...period.toObject(),
                totalLoginTime,
                totalDuration,
                totalResourceTime
            }
        })

        res.json({
            periods,
            page: pageNumber,
            pages: Math.ceil(count / pageSize),
            totalLoginTimeSum, // Sum of all login times
            totalDurationSum, // Sum of all durations
            totalResourceTimeSum // Sum of all resource times
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}





export const getAllPeriodsReport = async (req, res, next) => {
    try {
        // Extract year and month from query parameters
        const { year, month } = req.query

        // Default to current year and month if not provided
        const now = moment()
        const selectedYear = year ? parseInt(year) : now.year()
        const selectedMonth = month ? moment().month(month).format('MMMM') : now.format('MMMM')

        // Calculate the start and end dates for the selected month
        const startOfMonth = moment().year(selectedYear).month(selectedMonth).startOf('month').toDate()
        const endOfMonth = moment().year(selectedYear).month(selectedMonth).endOf('month').toDate()

        // Fetch periods within the selected month
        const periods = await Period.find({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        })
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
                updatedAt,
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

            const totalLoggedInTime = calculateTotalLoggedInTime(loggedIn, loggedOut, updatedAt)
            teacherData[teacherName].totalLoggedInTime += totalLoggedInTime

            const totalResourceTime = calculateTotalResourceTime(accessedFiles)
            teacherData[teacherName].totalResourceTime += totalResourceTime
        })

        for (const teacherName in teacherData) {
            const { totalDuration, totalLoggedInTime, totalResourceTime } = teacherData[teacherName]

            teacherData[teacherName].totalDuration = formatHoursMinutes(totalDuration)
            teacherData[teacherName].totalLoggedInTime = formatHoursMinutes(totalLoggedInTime)
            teacherData[teacherName].totalResourceTime = formatHoursMinutes(totalResourceTime)
        }

        res.json(teacherData)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

const calculateTotalDuration = (accessedFiles) => {
    return accessedFiles.reduce((totalDuration, file) => {
        return totalDuration + file.duration
    }, 0) / 60000
}

const calculateTotalLoggedInTime = (loggedIn, loggedOut, updatedAt) => {
    const loggedInTime = new Date(loggedIn)
    const loggedOutTime = loggedOut ? new Date(loggedOut) : new Date(updatedAt)
    const timeDifference = loggedOutTime - loggedInTime
    return timeDifference / (1000 * 60)
}

const calculateTotalResourceTime = (accessedFiles) => {
    return accessedFiles.reduce((totalTime, file) => {
        const fromTime = new Date(file.fromTime)
        const toTime = new Date(file.toTime)
        const timeDifference = toTime - fromTime
        return totalTime + (timeDifference / (1000 * 60))
    }, 0)
}

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