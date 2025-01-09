const { Branch, Course } = require('../../models/CourseBranch');
const Subject = require('../../models/Subjects.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({
        courseName: 1,
    });
    res.status(200).json(courses);
};

module.exports.getBranches = async (req, res, next) => {
    const course = await Course.findOne({
        courseCode: { $regex: new RegExp(`^${req.params.course}$`, 'i') },
    });

    if (!course) {
        return next(errorHandler(403, 'Course not found'));
    }

    const branches = await Branch.find({ course: course._id }).sort({
        branchName: 1,
    });

    res.status(200).json(branches);
};

module.exports.getSubjects = async (req, res, next) => {
    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${req.params.branch}$`, 'i') },
    });

    if (!branch) {
        return next(errorHandler(403, 'Branch not found'));
    }

    const subjects = await Subject.find({ branch: branch._id }).sort({
        subjectName: 1,
    });
    res.status(200).json(subjects);
};
