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
            enum: ['earn', 'redeem', 'reduction'],
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        resourceType: {
            type: String,
            enum: ['pyq', 'senior', 'notes'],
            required: true,
        },
        resourceId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
