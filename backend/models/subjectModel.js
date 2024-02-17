import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;