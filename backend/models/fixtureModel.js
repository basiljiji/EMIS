import mongoose from 'mongoose';

const fixtureSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
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
    hour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hour'
    },
    date: {
        type: Date,
        default: () => {
            const now = new Date().toISOString().substring(0, 10);
            return now;
        }
    },
    isDeleted: {
        status: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        },
        deletedTime: {
            type: Date,
            default: Date.now()
        }
    }
}, {
    timestamps: true
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;