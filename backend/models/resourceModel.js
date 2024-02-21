import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    portionTitle: {
        type: String,
    },
    filePath: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileType: {
        type: String,
    },
    fileSize: {
        type: Number
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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


const Resource = mongoose.model('Resource', resourceSchema)

export default Resource