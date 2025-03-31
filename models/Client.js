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
        phone: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        college: {
            type: String,
        },
        rewardPoints: {
            type: Number,
            default: 0,
        },
        rewardRedeemed: {
            type: Number,
            default: 0,
        },
        rewardBalance: {
            type: Number,
            default: 0,
        },
        savedPYQs: [
            {
                pyqId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewPyqs' },
                savedAt: { type: Date, default: Date.now },
            },
        ],
        savedNotes: [
            {
                noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes' },
                savedAt: { type: Date, default: Date.now },
            },
        ],
        purchasedPYQs: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'NewPyqs' },
        ],
        purchasedNotes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Notes' },
        ],
    },
    { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
