const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
        },
        courseCode: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const BranchSchema = new mongoose.Schema(
    {
        branchName: {
            type: String,
            required: true,
        },
        branchCode: {
            type: String,
            required: true,
            unique: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
const Branch = mongoose.model('Branch', BranchSchema);

module.exports = { Course, Branch };
