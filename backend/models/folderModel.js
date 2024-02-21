import mongoose from 'mongoose'

const folderSchema = new mongoose.Schema({
    folderName: {
        type: String,
    },
    classdata: {
        classAccess: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    },
    createdBy: {
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


const Folder = mongoose.model('Folder', folderSchema)

export default Folder