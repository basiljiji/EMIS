import mongoose from 'mongoose';

const classDetailSchema = new mongoose.Schema({
    class: {
        type: String
    },
    section: {
        type: String,
    },
    subject: {
        type: String,
    },
    hour: {
        type: Number,
    }
});

const fixtureSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    classDetails: [classDetailSchema]
}, {
    timestamps: true
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;