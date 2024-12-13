const mongoose = require('mongoose');

const PyqRequestSchema = new mongoose.Schema(
    {
        subject: { type: String, required: true },
        semester: { type: String, required: true },
        year: { type: String, required: true },
        branch: { type: String },
        examType: { type: String, required: true },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        description: { type: String },
        whatsapp: { type: Number, required: true },
        status: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PyqRequest', PyqRequestSchema);
