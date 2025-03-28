const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        typeOfPurchase: {
            type: String,
            enum: ['Pyq purchase', 'note purchase', 'course purchase'],
            required: true,
        },
        purchaseItemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'purchaseItemType',
        },

        paymentId: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
        amount: { type: Number, required: true },
        provider: { type: String, required: true },
        paymentLink: { type: String },
        failureReason: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
