import mongoose from 'mongoose'

const folderSchema = new mongoose.Schema({
    folderName: {
        type: String,
    },
    accessTo: {
        classAccess: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }],
        sectionAccess: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }],
        subjectAccess: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }],
        teacherAccess: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        }]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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