import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Keep only latest token per user by creating a unique index on user
tokenSchema.index({ user: 1 }, { unique: true })

const Token = mongoose.model('Token', tokenSchema)

export default Token


