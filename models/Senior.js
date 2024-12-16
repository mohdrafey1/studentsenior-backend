const mongoose = require('mongoose');

const seniorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
        },
        profilePicture: {
            type: String,
            default:
                'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
        },
        whatsapp: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        telegram: {
            type: String,
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        status: { type: Boolean, default: false },
        priority: { type: Number, default: 10 },
        clickCount: { type: Number, default: 0 },
        slug: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const Senior = mongoose.model('Senior', seniorSchema);

module.exports = Senior;
