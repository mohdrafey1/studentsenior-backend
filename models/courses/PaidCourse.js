const mongoose = require('mongoose');

const PaidCourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: [
                'Web Development',
                'Data Science',
                'AI/ML',
                'Marketing',
                'Business',
                'Other',
            ],
            required: true,
        },
        instructor: { type: String, required: true },

        content: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'CourseContent' },
        ],
        thumbnail: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        enrolledStudents: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
                purchasedAt: { type: Date, default: Date.now },
            },
        ],
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        courseDuration: { type: String },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PaidCourse', PaidCourseSchema);
