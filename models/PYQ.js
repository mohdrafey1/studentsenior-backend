const mongoose = require('mongoose');

const PYQSchema = new mongoose.Schema(
    {
        subjectName: { type: String, required: true },
        subjectCode: { type: String, required: true },
        semester: { type: String, required: true },
        year: { type: String, required: true },
        branch: [{ type: String }],
        course: { type: String, required: true },
        examType: { type: String, required: true },
        link: { type: String, required: true },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        status: { type: Boolean, default: false },
        clickCount: { type: Number, default: 0 },
        slug: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PYQ', PYQSchema);
