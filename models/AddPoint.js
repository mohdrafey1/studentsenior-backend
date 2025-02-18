const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        pointsAdded: {
            type: Number,
            required: true,
            min: 0,
        },
        rupees: {
            type: Number,
            required: true,
            min: 0,
        },
        transactionId: {
            type: String,

            trim: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('AddPoint', pointSchema);
