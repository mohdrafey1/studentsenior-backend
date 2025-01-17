const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        type: {
            type: String,
            enum: ['earn', 'redeem', 'reduction', 'bonus'],
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        resourceType: {
            type: String,
            enum: ['pyq', 'senior', 'notes'],
        },
        resourceId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
