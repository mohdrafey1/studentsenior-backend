const { Branch, Course } = require('../../../models/CourseBranch');
const { errorHandler } = require('../../../utils/error');

const branchController = {
    async index(req, res) {
        const { course, search } = req.query;

        const query = {};
        if (course && course.trim() !== '') {
            query.course = course;
        }
        if (search && search.trim() !== '') {
            query.branchName = { $regex: search, $options: 'i' };
        }

        const branches = await Branch.find(query)
            .populate('course')
            .sort({ branchName: -1 });
        const courses = await Course.find();
        res.render('branchCourse/branches/index', {
            branches,
            courses,
            selectedCourse: course || '',
            search,
        });
    },

    async new(req, res) {
        const courses = await Course.find();
        res.render('branchCourse/branches/new', { courses });
    },
    async create(req, res, next) {
        const { branchName, branchCode, course } = req.body;

        const existingBranch = await Branch.findOne({ branchCode });
        if (existingBranch) {
            return next(
                errorHandler(
                    401,
                    `Branch code '${branchCode}' is already in use. Please use a different code.`
                )
            );
        }
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
