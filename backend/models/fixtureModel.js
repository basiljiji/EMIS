import mongoose from 'mongoose';

const fixtureSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
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
    }
}, {
    timestamps: true
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;