import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subject: {
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
});


const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;