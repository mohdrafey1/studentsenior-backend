const Course = require('../../models/courses/PaidCourse');
const { errorHandler } = require('../../utils/error');

// Get all courses
module.exports.index = async (req, res) => {
    const allCourses = await Course.find({}).select(
        'title description thumbnail instructor price level slug duration enrolledStudents'
    );

    res.status(200).json(allCourses);
};

// Get a single course by slug
module.exports.showCourse = async (req, res) => {
    const { slug } = req.params;
    const userId = req.user.id;

    const course = await Course.findOne({ slug: slug });

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the user is enrolled in this course
    const isEnrolled = course.enrolledStudents?.some(
        (student) =>
            student.userId && student.userId.toString() === userId.toString()
    );

    console.log(course.enrolledStudents);
    console.log(isEnrolled);
    console.log(userId);

    // If the user is NOT enrolled, do not send course content
    const responseData = {
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        level: course.level,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        isEnrolled: isEnrolled, // Helps frontend determine access
        content: isEnrolled ? course.content : [], // Send content only if enrolled
        courseDuration: course.courseDuration,
        startDate: course.startDate,
    };

    res.status(200).json(responseData);
};

module.exports.enrollCourse = async (req, res, next) => {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
        return next(errorHandler(404, 'Course not found'));
    }

    console.log(req.user.id);

    if (
        course.enrolledStudents?.some(
            (student) =>
                student.userId &&
                student.userId.toString() === userId.toString()
        )
    ) {
        return next(
            errorHandler(400, 'You are already enrolled in this course.')
        );
    }

    course.enrolledStudents.push({ userId: req.user.id });
    await course.save();

    res.status(200).json({ message: 'Successfully enrolled in course!' });
};
