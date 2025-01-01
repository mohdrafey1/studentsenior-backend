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
        try {
            await Branch.create(req.body);
            res.redirect('/branches');
        } catch (error) {
            res.status(400).send('Error creating branch');
        }
    },
    async edit(req, res) {
        const branch = await Branch.findById(req.params.id);
        const courses = await Course.find();
        res.render('branchCourse/branches/edit', { branch, courses });
    },
    async update(req, res) {
        try {
            await Branch.findByIdAndUpdate(req.params.id, req.body);
            res.redirect('/branches');
        } catch (error) {
            res.status(400).send('Error updating branch');
        }
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
