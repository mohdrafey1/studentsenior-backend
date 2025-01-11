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
        totalBranch: {
            type: Number,
            default: 0,
        },
        clickCounts: {
            type: Number,
            default: 0,
        },
        totalNotes: {
            type: Number,
            default: 0,
        },
        totalPyqs: {
            type: Number,
            default: 0,
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
        totalSubject: {
            type: Number,
            default: 0,
        },
        totalSenior: {
            type: Number,
            default: 0,
        },
        clickCounts: {
            type: Number,
            default: 0,
        },
        totalNotes: {
            type: Number,
            default: 0,
        },
        totalPyqs: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
const Branch = mongoose.model('Branch', BranchSchema);

module.exports = { Course, Branch };
