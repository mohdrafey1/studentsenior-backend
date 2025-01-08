const { Course } = require('../../models/CourseBranch');

const courseController = {
    async index(req, res) {
        const courses = await Course.find().sort({ courseName: 1 });
        res.render('branchCourse/courses/index', { courses });
    },

    new(req, res) {
        res.render('branchCourse/courses/new');
    },

    async create(req, res) {
        await Course.create(req.body);
        res.redirect('/courses');
    },

    async edit(req, res) {
        const course = await Course.findById(req.params.id);
        res.render('branchCourse/courses/edit', { course });
    },

    async update(req, res) {
        await Course.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/courses');
    },

    async delete(req, res) {
        await Course.findByIdAndDelete(req.params.id);
        res.redirect('/courses');
    },
};

module.exports = courseController;
