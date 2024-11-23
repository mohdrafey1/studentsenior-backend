const { Course } = require('../../models/CourseBranch');

const courseController = {
    async index(req, res) {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.render('branchCourse/courses/index', { courses });
    },
    new(req, res) {
        res.render('branchCourse/courses/new');
    },
    async create(req, res) {
        try {
            await Course.create(req.body);
            res.redirect('/courses');
        } catch (error) {
            res.status(400).send('Error creating course');
        }
    },
    async edit(req, res) {
        const course = await Course.findById(req.params.id);
        res.render('branchCourse/courses/edit', { course });
    },
    async update(req, res) {
        try {
            await Course.findByIdAndUpdate(req.params.id, req.body);
            res.redirect('/courses');
        } catch (error) {
            res.status(400).send('Error updating course');
        }
    },
    async delete(req, res) {
        try {
            await Course.findByIdAndDelete(req.params.id);
            res.redirect('/courses');
        } catch (error) {
            res.status(400).send('Error deleting course');
        }
    },
};

module.exports = courseController;
