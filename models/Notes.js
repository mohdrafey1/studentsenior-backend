const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema(
    {
        subjectName: { type: String, required: true },
        link: { type: String, required: true },
        description: { type: String, required: true },
        target: { type: String, required: true },
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        status: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notes', NotesSchema);
