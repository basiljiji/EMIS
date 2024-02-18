import mongoose from 'mongoose'

const classSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    isDeleted: {
        status: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        deletedTime: {
            type: Date,
            default: Date.now()
        }
    }
}, {
    timestamps: true
})


const Class = mongoose.model('Class', classSchema)

export default Class