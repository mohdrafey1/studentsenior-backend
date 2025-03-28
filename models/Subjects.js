const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true,
        },
        subjectCode: {
            type: String,
            required: true,
        },
        semester: {
            type: Number,
            required: true,
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: true,
        },
        totalNotes: {
            type: Number,
            default: 0,
        },
        totalPyqs: {
            type: Number,
            default: 0,
        },
        clickCounts: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
