import Token from '../models/tokenModel.js'
import Period from '../models/periodModel.js'

/**
 * Cleanup function to record logout time when token is invalid or expired
 * This ensures logout time is recorded even when token is deleted from DB
 */
export const cleanupExpiredToken = async (userId) => {
    try {
        // Find and update any active period for this teacher
        const period = await Period.findOneAndUpdate(
            {
                teacher: userId,
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

        if (period) {
            console.log(`Logout time recorded for teacher ${userId}: ${new Date(period.loggedOut).toISOString()}`)
        } else {
            console.log(`No active period found for teacher ${userId}`)
        }

        // Delete the token from database
        await Token.findOneAndDelete({ user: userId })

        console.log(`Token cleanup completed for user: ${userId}`)
        return period
    } catch (error) {
        console.error('Error during token cleanup:', error)
        throw error
    }
}

/**
 * Cleanup function for when token doesn't match latest stored token
 */
export const cleanupInvalidToken = async (userId, token) => {
    try {
        // Find the latest token for this user
        const latestToken = await Token.findOne({ user: userId })

        if (latestToken && latestToken.token !== token) {
            // Token mismatch - record logout for the previous session
            await cleanupExpiredToken(userId)
        }
    } catch (error) {
        console.error('Error during invalid token cleanup:', error)
        throw error
    }
}
