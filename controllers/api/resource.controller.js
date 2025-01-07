const { Branch, Course } = require('../../models/CourseBranch');
const Subject = require('../../models/Subjects.js');

module.exports.getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({
        courseName: 1,
    });
    res.status(200).json(courses);
};

module.exports.getBranches = async (req, res) => {
    const branches = await Branch.find({ course: req.params.course }).sort({
        branchName: 1,
    });
    res.status(200).json(branches);
};

module.exports.getSubjects = async (req, res) => {
    const subjects = await Subject.find({ branch: req.params.branch }).sort({
        subjectName: 1,
    });
    res.status(200).json(subjects);
};
