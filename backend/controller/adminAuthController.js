import Admin from "../models/adminModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import generateToken from "../utils/generateToken.js"


export const loginAdmin = async (req, res, next) => {
    try {

        const { email, password } = req.body
        const admin = await Admin.findOne({ email })

        if (admin && await admin.matchPassword(password)) {

            generateToken(res, admin._id)


            res.status(200).json({ role: admin.role, email: admin.email, name: admin.username })
        } else {
            const error = new HttpError("Invalid Username or Password", 404)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }


}

export const registerAdmin = async (req, res, next) => {
    try {
        
        const username = process.env.ADMIN_USERNAME
        const email = process.env.ADMIN_EMAIL
        const password = process.env.ADMIN_PASSWORD
        const role = process.env.ADMIN_ROLE
        // const adminId = req.admin

        // const superAdmin = await Admin.findOne({ _id: adminId, role: "SUPERADMIN" })

        // if (!superAdmin) {
        //     const error = new HttpError("Could Not Add User", 400)
        //     return next(error)
        // } else {
            const adminExists = await Admin.findOne({ email })

            if (adminExists) {
                const error = new HttpError("Admin Already Exists", 400)
                return next(error)
            }

            const admin = await Admin.create({
                username,
                email,
                password,
                role
            })

            if (admin) {
                res.status(201).json({
                    name: username,
                    email: email
                })
            } else {
                res.status(400)
                const error = new HttpError("Invalid user data", 400)
                return next(error)
            }
        // }
    } catch (err) {
        const error = new HttpError("Something went wrong", 500)
        return next(error)
    }
}

export const logoutAdmin = async (req, res, next) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged Out Successfully" })
}