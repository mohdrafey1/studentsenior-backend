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
        createdAt: -1,
    });
    res.status(200).json(subjects);
};

module.exports.addSubject = async (req, res, next) => {
    const { subjectName, subjectCode, semester, branch } = req.body;

    const existingSubject = await Subject.findOne({
        subjectName: subjectName,
        subjectCode: subjectCode,
        semester: semester,
        branch: branch,
    });

    if (existingSubject) {
        return next(
            errorHandler(401, 'This subject is already added in this branch')
        );
    }

    const newSubject = new Subject({
        subjectCode,
        subjectName,
        branch,
        semester,
    });

    if (branch) {
        const branchData = await Branch.findById(branch);
        if (branchData) {
            branchData.totalSubject += 1;
            await branchData.save();
        }
    }

    await newSubject.save();

    res.json({ message: 'New Subject Added Successfully' });
};

module.exports.editSubject = async (req, res, next) => {
    const { id } = req.params;
    const { subjectName, subjectCode, semester } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        { subjectName, subjectCode, semester },
        { new: true }
    );

    if (!updatedSubject) {
        return next(errorHandler(401, 'Subject not found'));
    }

    res.json({ message: 'Subject updated successfully' });
};

module.exports.deleteSubject = async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (subject) {
        const branch = await Branch.findById(subject.branch);
        if (branch) {
            branch.totalSubject -= 1;
            await branch.save();
        }
        await subject.deleteOne();
    }
    res.json({ message: 'Subject deleted successfully' });
};
