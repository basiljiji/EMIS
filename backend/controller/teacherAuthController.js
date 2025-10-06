import Teacher from "../models/teacherModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import generateToken from "../utils/generateToken.js"
import Token from "../models/tokenModel.js"
import Period from "../models/periodModel.js"
import { cleanupExpiredToken } from "../utils/tokenCleanup.js"


export const loginTeacher = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const teacher = await Teacher.findOne({ email })

        if (!teacher) {
            const error = new HttpError("Teacher not found", 404)
            return next(error)
        }

        // Check if there's an existing period for the teacher
        const existingPeriod = await Period.findOne({ teacher: teacher._id, expired: false })
        if (existingPeriod) {
            // Fetch the existing period document to get the current updatedAt value
            const periodToUpdate = await Period.findById(existingPeriod._id)

            if (periodToUpdate) {
                // Update the period to set expired: true and loggedOut to the current updatedAt value
                await Period.findByIdAndUpdate(existingPeriod._id, {
                    expired: true,
                    loggedOut: periodToUpdate.updatedAt // Set loggedOut to the existing updatedAt value
                })
            }
        }
        if (teacher && await teacher.matchPassword(password)) {
            const signedToken = generateToken(res, teacher._id)

            // Upsert latest token for this teacher
            await Token.findOneAndUpdate(
                { user: teacher._id },
                { token: signedToken, issuedAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )

            // Create a new period for the teacher
            const newPeriod = await Period.create({
                teacher: teacher._id,
                loggedIn: Date.now()
            })

            res.status(200).json({
                name: teacher.firstName,
                email: teacher.email,
                id: teacher._id
            })
        } else {
            const error = new HttpError("Invalid Username or Password", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const logoutTeacher = async (req, res, next) => {

    if (req.teacher) {
        // Find and update any active period for this teacher (regardless of day)
        const period = await Period.findOneAndUpdate(
            {
                teacher: req.teacher._id,
                expired: false
            },
            {
                $set: {
                    loggedOut: Date.now(),
                    expired: true
                }
            },
            {
                new: true
            }
        )

        // Delete the token from database
        await Token.findOneAndDelete({ user: req.teacher._id })
    }


    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged Out Successfully" })
}

// Manual cleanup endpoint for admin use
export const forceLogoutTeacher = async (req, res, next) => {
    try {
        const { teacherId } = req.body

        if (!teacherId) {
            const error = new HttpError("Teacher ID is required", 400)
            return next(error)
        }

        // Force cleanup for this teacher
        await cleanupExpiredToken(teacherId)

        res.status(200).json({
            message: "Teacher force logged out successfully",
            teacherId: teacherId
        })
    } catch (err) {
        const error = new HttpError("Something went wrong during force logout", 500)
        return next(error)
    }
}