import mongoose from 'mongoose'

const nestedSubfolderSchema = new mongoose.Schema({
    nestedSubfolderName: {
        type: String,
    },
    folderTitle: {
        type: String,
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    parentSubfolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subfolder',
        default: null
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

const NestedSubfolder = mongoose.model('NestedSubfolder', nestedSubfolderSchema)

export default NestedSubfolder
