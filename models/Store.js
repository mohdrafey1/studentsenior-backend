const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
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

        available: { type: Boolean, default: true },

        image: {
            url: String,
            filename: String,
        },
        whatsapp: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        telegram: {
            type: String,
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        status: { type: Boolean, default: false },
        clickCount: { type: Number, default: 0 },
        slug: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
