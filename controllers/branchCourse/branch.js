const { Branch, Course } = require('../../models/CourseBranch');

const branchController = {
    async index(req, res) {
        const branches = await Branch.find()
            .populate('course')
            .sort({ createdAt: -1 });
        res.render('branchCourse/branches/index', { branches });
    },
    async new(req, res) {
        const courses = await Course.find();
        res.render('branchCourse/branches/new', { courses });
    },
    async create(req, res) {
        const { branchName, branchCode, course } = req.body;

        const newBranch = await Branch.create({
            branchName,
            branchCode,
            course,
        });

        if (newBranch) {
            await Course.findByIdAndUpdate(course, {
                $inc: { totalBranch: 1 },
            });
        }

        res.redirect('/branches');
    },
    async edit(req, res) {
        const branch = await Branch.findById(req.params.id);
        const courses = await Course.find();
        res.render('branchCourse/branches/edit', { branch, courses });
    },
    async update(req, res) {
        await Branch.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/branches');
    },
    async delete(req, res) {
        const branch = await Branch.findById(req.params.id);

        if (branch.course) {
            await Course.findByIdAndUpdate(branch.course, {
                $inc: { totalBranch: -1 },
            });
        }
        await Branch.findByIdAndDelete(req.params.id);

        req.flash('success', 'Branch Deleted Successfully');
        res.redirect('/branches');
    },
};

module.exports = branchController;
