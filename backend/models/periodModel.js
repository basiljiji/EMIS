import mongoose from 'mongoose'

const periodSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    day: {
        type: Date,
        default: () => {
            const now = new Date().toISOString().substring(0, 10)
            return now
        }
    },
    classData: [{
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder'
        },
    }],
    expired: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Date
    },
    loggedOut: {
        type: Date
    },
    token: {
        type: String
    },
    accessedFiles: [{
        fileUrl: {
            type: String
        },
        fromTime: {
            type: Date
        },
        toTime: {
            type: Date
        },
        duration: {
            type: Number
        }
    }]
}, {
    timestamps: true
})

const Period = mongoose.model('Period', periodSchema)

export default Period
