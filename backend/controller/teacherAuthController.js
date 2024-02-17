import Teacher from "../models/teacherModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import jwt from 'jsonwebtoken'


export const loginTeacher = async (req, res, next) => {
    try {

        const { email, password } = req.body
        const teacher = await Teacher.findOne({ email })

        if (teacher && await teacher.matchPassword(password)) {

            const token = jwt.sign({ teacherId: teacher._id },
                process.env.JWT_SECRET, {
                expiresIn: '30d'
            })

            //Set JWT as HTTP-Only cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 Days
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


}

export const logoutTeacher = async (req, res, next) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged Out Successfully" })
}