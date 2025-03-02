const { Branch, Course } = require('../../models/CourseBranch.js');
const Subject = require('../../models/Subjects.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({
        createdAt: -1,
    });
    res.status(200).json(courses);
};

module.exports.getBranches = async (req, res) => {
    const branches = await Branch.find({}).populate('course').sort({
        createdAt: -1,
    });

    res.status(200).json(branches);
};

module.exports.getSubjects = async (req, res) => {
    const subjects = await Subject.find({}).populate('branch').sort({
        created: -1,
    });
    res.status(200).json(subjects);
};
