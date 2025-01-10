const { Branch, Course } = require('../../models/CourseBranch');
const Subject = require('../../models/Subjects.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({
        clickCounts: -1,
    });
    res.status(200).json(courses);
};

module.exports.getBranches = async (req, res, next) => {
    const course = await Course.findOneAndUpdate(
        { courseCode: { $regex: new RegExp(`^${req.params.course}$`, 'i') } },
        { $inc: { clickCounts: 1 } },
        { new: true }
    );

    if (!course) {
        return next(errorHandler(403, 'Course not found'));
    }

    const branches = await Branch.find({ course: course._id }).sort({
        clickCounts: -1,
    });

    res.status(200).json(branches);
};

module.exports.getSubjects = async (req, res, next) => {
    const branch = await Branch.findOneAndUpdate(
        { branchCode: { $regex: new RegExp(`^${req.params.branch}$`, 'i') } },
        { $inc: { clickCounts: 1 } },
        { new: true }
    );

    if (!branch) {
        return next(errorHandler(403, 'Branch not found'));
    }

    const subjects = await Subject.find({ branch: branch._id }).sort({
        clickCounts: -1,
    });
    res.status(200).json(subjects);
};
