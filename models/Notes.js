const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject',
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Client',
            default: [],
        },
        rewardPoints: {
            type: Number,
            default: 5,
            min: 0,
        },
        clickCounts: {
            type: Number,
            default: 0,
        },

        isPaid: { type: Boolean, default: false },
        price: { type: Number, default: 0, min: 0 },
        purchasedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notes', NotesSchema);
