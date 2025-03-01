const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ['lost', 'found'], required: true },
        currentStatus: {
            type: String,
            enum: ['pending', 'claimed', 'resolved'],
            default: 'pending',
        },
        status: { type: Boolean, default: true },

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
        slug: { type: String, unique: true },
        clickCounts: { type: Number, default: 0 },
        location: { type: String, required: true },
        imageUrl: { type: String },
        whatsapp: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('LostFound', LostFoundSchema);
