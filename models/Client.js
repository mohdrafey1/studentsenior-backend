const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default:
                'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
        },
    },
    { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
