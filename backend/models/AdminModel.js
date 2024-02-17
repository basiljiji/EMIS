import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
    },
    lastName: {
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
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;