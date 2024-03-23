import Teacher from "../models/teacherModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import generateToken from "../utils/generateToken.js"
import Period from "../models/periodModel.js"


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
            // If there's an existing period with expired: false, update it to expired: true
            await Period.findByIdAndUpdate(existingPeriod._id, { expired: true })
        }

        if (teacher && await teacher.matchPassword(password)) {
            generateToken(res, teacher._id)

            // Create a new period for the teacher
            const newPeriod = await Period.create({
                teacher: teacher._id,
                loggedIn: Date.now()
            })

            res.status(200).json({
                name: teacher.firstName,
                email: teacher.email,
            })
        } else {
            const error = new HttpError("Invalid Username or Password", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
};

export const logoutTeacher = async (req, res, next) => {

    if(req.teacher){
        const period = await Period.findOneAndUpdate(
            {
                teacher: req.teacher._id,
                day: new Date().toISOString().substring(0, 10),
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
    }
  

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged Out Successfully" })
}