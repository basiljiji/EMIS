import jwt from 'jsonwebtoken'
import Teacher from '../models/teacherModel.js'
import Admin from '../models/adminModel.js'
import HttpError from './httpErrorMiddleware.js'
import Token from '../models/tokenModel.js'
import { cleanupExpiredToken, cleanupInvalidToken } from './tokenCleanup.js'


export const authenticateTeacher = async (req, res, next) => {
    let token
    token = req.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Check if token exists in database
            const latestTokenDoc = await Token.findOne({ user: decoded.userId })

            if (!latestTokenDoc) {
                // Token was deleted from DB - cleanup and logout
                await cleanupExpiredToken(decoded.userId)
                const error = new HttpError("Session expired. Please login again.", 401)
                return next(error)
            }

            if (latestTokenDoc.token !== token) {
                // Token mismatch - cleanup previous session and logout
                await cleanupInvalidToken(decoded.userId, token)
                const error = new HttpError("Session expired. Please login again.", 401)
                return next(error)
            }

            req.teacher = await Teacher.findById(decoded.userId).select('-password')
            next()
        } catch (err) {
            // JWT verification failed - could be expired or invalid
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                // Try to get userId from token payload for cleanup (even if expired)
                try {
                    const decoded = jwt.decode(token)
                    if (decoded && decoded.userId) {
                        await cleanupExpiredToken(decoded.userId)
                    }
                } catch (cleanupErr) {
                    console.error('Error during token cleanup:', cleanupErr)
                }
            }

            const error = new HttpError("Not Authorized, token failed", 401)
            return next(error)
        }
    } else {
        const error = new HttpError("Not Authorized, No Token", 401)
        return next(error)
    }
}

export const authenticateAdmin = async (req, res, next) => {
    try {
        let token
        token = req.cookies.jwt


        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                req.admin = await Admin.findById(decoded.userId).select('-password')
                next()
            } catch (err) {
                const error = new HttpError("Not Authorized, token failed", 401)
                return next(error)
            }
        } else {
            const error = new HttpError("Not Authorized, No Token", 401)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError("Something Went Wrong with Login", 500)
        return next(error)
    }

}