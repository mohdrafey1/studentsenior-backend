const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        typeOfPurchase: {
            type: String,
            enum: [
                'course_purchase',
                'note_purchase',
                'pyq_purchase',
                'add_points',
            ],
            required: true,
        },
        purchaseItemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        merchantOrderId: {
            type: String,
            required: true,
            unique: true,
        },
        phonePeOrderId: String,
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        currency: {
            type: String,
            default: 'INR',
        },
        provider: {
            type: String,
            default: 'PhonePe',
        },
        paymentLink: String,

        paymentResponse: Object,
        redirectBackUrl: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
