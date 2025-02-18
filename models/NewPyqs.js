const mongoose = require('mongoose');

const NewPyqSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        slug: { type: String, unique: true, required: true },
        fileUrl: { type: String, required: true },
        year: { type: String, required: true },
        examType: { type: String, required: true },
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
        status: { type: Boolean, default: false },
        rewardPoints: { type: Number, default: 10, min: 0 },
        clickCounts: { type: Number, default: 0 },
        solved: { type: Boolean, default: false },

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

module.exports = mongoose.model('NewPyq', NewPyqSchema);
