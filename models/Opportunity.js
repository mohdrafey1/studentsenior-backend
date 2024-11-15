const mongoose = require('mongoose');
const { Schema } = mongoose;

const getOpportunitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        status: { type: Boolean, default: false },
        whatsapp: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

const giveOpportunitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        status: { type: Boolean, default: false },
        whatsapp: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = {
    GetOpportunity: mongoose.model('GetOpportunity', getOpportunitySchema),
    GiveOpportunity: mongoose.model('GiveOpportunity', giveOpportunitySchema),
};
