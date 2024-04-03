import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    // Generate JWT Token with 1-hour expiration
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'strict',
        // maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    })
}

export default generateToken
