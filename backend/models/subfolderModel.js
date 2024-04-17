import mongoose from 'mongoose'

const subfolderSchema = new mongoose.Schema({
    subfolderName: {
        type: String,
    },
    folderTitle: {
        type: String,
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    resources: [{
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
    }],
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


const Subfolder = mongoose.model('Subfolder', subfolderSchema)

export default Subfolder