import mongoose from 'mongoose';

const hourSchema = new mongoose.Schema({
    hour: {
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


const Hour = mongoose.model('Hour', hourSchema);

export default Hour;