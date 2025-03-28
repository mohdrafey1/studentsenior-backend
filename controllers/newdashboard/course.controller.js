const Course = require('../../models/courses/PaidCourse');
const { errorHandler } = require('../../utils/error');

// Get all courses
module.exports.index = async (req, res) => {
    const allCourses = await Course.find({}).select(
        'title description thumbnail instructor price level'
    );

    res.status(200).json(allCourses);
};

// Get a single course by slug
module.exports.showCourse = async (req, res) => {
    const { slug } = req.params;
    const course = await Course.findOne({ slug: slug }).populate({
        path: 'content',
        options: { sort: { order: 1 } },
    });

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
};

// Create a new course
module.exports.createCourse = async (req, res, next) => {
    const {
        title,
        description,
        price,
        category,
        level,
        thumbnail,
        instructor,
        courseDuration,
        startDate,
    } = req.body;
    const slug = title.replace(/\s+/g, '-').toLowerCase();

    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
        return next(
            errorHandler(400, 'Course with this title already exists.')
        );
    }

    const newCourse = new Course({
        title,
        description,
        price,
        category,
        level,
        thumbnail,
        slug,
        instructor,
        courseDuration,
        startDate,
    });

    await newCourse.save();
    res.status(201).json({
        message: 'Course created successfully',
        course: newCourse,
    });
};

// Update course details
module.exports.editCourse = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        price,
        category,
        level,
        thumbnail,
        slug,
        courseDuration,
        startDate,
    } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
            title,
            description,
            price,
            category,
            level,
            thumbnail,
            slug,
            courseDuration,
            startDate,
        },
        { new: true }
    );

    if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
        message: 'Course updated successfully',
        course: updatedCourse,
    });
};

// Delete a course
module.exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
};
