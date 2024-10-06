const { string, required } = require('joi');
const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Affiliate = mongoose.model('Affiliate', affiliateSchema);

module.exports = Affiliate;
