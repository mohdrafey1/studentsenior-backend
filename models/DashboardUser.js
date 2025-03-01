const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardUserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        college: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['Admin', 'Moderator', 'Visitor'],
            default: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('DashboardUser', DashboardUserSchema);
