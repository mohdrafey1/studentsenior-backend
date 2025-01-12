const mongoose = require('mongoose');

const RedemptionRequestSchema = new mongoose.Schema(
    {
        upiId: { type: String, required: true },
        rewardBalance: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RedemptionRequest', RedemptionRequestSchema);
