import mongoose from 'mongoose';

const hourSchema = new mongoose.Schema({
    hour: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const Hour = mongoose.model('Hour', hourSchema);

export default Hour;