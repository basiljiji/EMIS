import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        default: "admin"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;