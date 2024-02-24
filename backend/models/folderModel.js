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
        }]
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