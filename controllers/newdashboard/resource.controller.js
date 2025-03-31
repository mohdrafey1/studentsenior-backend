const { Branch, Course } = require('../../models/CourseBranch.js');
const Subject = require('../../models/Subjects.js');
const { errorHandler } = require('../../utils/error.js');

module.exports = {
    // Get all courses
    getCourses: async (req, res) => {
        const courses = await Course.find({}).sort({ createdAt: -1 });
        res.status(200).json(courses);
    },

    // Create a course
    createCourse: async (req, res, next) => {
        const { courseName, courseCode } = req.body;

        const existingCourse = await Course.findOne({ courseCode });

        if (existingCourse) {
            return next(
                errorHandler(
                    401,
                    `Course code '${courseCode}' is already in use.`
                )
            );
        }

        await Course.create({ courseName, courseCode });

        res.json({ message: 'New Course Added Successfully' });
    },

    // Update a course
    updateCourse: async (req, res) => {
        await Course.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Course Updated Successfully' });
    },

    // Delete a course
    deleteCourse: async (req, res) => {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted Successfully' });
    },

    // Get all branches
    getBranches: async (req, res) => {
        const branches = await Branch.find({})
            .populate('course')
            .sort({ createdAt: -1 });
        res.status(200).json(branches);
    },

    // Create a branch
    createBranch: async (req, res, next) => {
        const { branchName, branchCode, course } = req.body;

        const existingBranch = await Branch.findOne({ branchCode });
        if (existingBranch) {
            return next(
                errorHandler(
                    401,
                    `Branch code '${branchCode}' is already in use.`
                )
            );
        }

        const newBranch = await Branch.create({
            branchName,
            branchCode,
            course,
        });

        if (newBranch && course) {
            await Course.findByIdAndUpdate(course, {
                $inc: { totalBranch: 1 },
            });
        }

        res.json({ message: 'Branch Added Successfully' });
    },

    // Update a branch
    updateBranch: async (req, res) => {
        await Branch.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Branch Updated Successfully' });
    },

    // Delete a branch
    deleteBranch: async (req, res) => {
        const branch = await Branch.findById(req.params.id);

        if (branch && branch.course) {
            await Course.findByIdAndUpdate(branch.course, {
                $inc: { totalBranch: -1 },
            });
        }

        await Branch.findByIdAndDelete(req.params.id);
        res.json({ message: 'Branch Deleted Successfully' });
    },

    // Get all subjects
    getSubjects: async (req, res) => {
        const subjects = await Subject.find({})
            .populate('branch')
            .sort({ createdAt: -1 });
        res.status(200).json(subjects);
    },

    // Add a subject
    addSubject: async (req, res, next) => {
        const { subjectName, subjectCode, semester, branch } = req.body;

        const existingSubject = await Subject.findOne({
            subjectName,
            subjectCode,
            semester,
            branch,
        });
        if (existingSubject) {
            return next(
                errorHandler(
                    401,
                    'This subject is already added in this branch.'
                )
            );
        }

        const newSubject = new Subject({
            subjectCode,
            subjectName,
            branch,
            semester,
        });
        await newSubject.save();

        if (branch) {
            const branchData = await Branch.findById(branch);
            if (branchData) {
                branchData.totalSubject = (branchData.totalSubject || 0) + 1;
                await branchData.save();
            }
        }

        res.json({ message: 'New Subject Added Successfully' });
    },

    // Edit a subject
    editSubject: async (req, res, next) => {
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
    },

    // Delete a subject
    deleteSubject: async (req, res) => {
        const { id } = req.params;
        const subject = await Subject.findById(id);

        if (subject) {
            const branch = await Branch.findById(subject.branch);
            if (branch) {
                branch.totalSubject = Math.max(0, branch.totalSubject - 1);
                await branch.save();
            }
            await subject.deleteOne();
        }

        res.json({ message: 'Subject deleted successfully' });
    },
};
