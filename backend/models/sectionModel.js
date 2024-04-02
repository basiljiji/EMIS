import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    section: {
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


const Section = mongoose.model('Section', sectionSchema);

export default Section;