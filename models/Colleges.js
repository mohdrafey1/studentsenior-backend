const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollegeSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        location: { type: String, required: true },
        status: { type: Boolean, default: false },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('College', CollegeSchema);
