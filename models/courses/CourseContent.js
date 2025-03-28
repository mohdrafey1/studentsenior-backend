const mongoose = require('mongoose');

const CourseContentSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaidCourse',
            required: true,
        },
        title: { type: String, required: true },
        type: { type: String, enum: ['video', 'pdf', 'image'], required: true },
        url: { type: String, required: true },
        duration: { type: Number },
        order: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('CourseContent', CourseContentSchema);
