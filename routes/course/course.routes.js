const express = require('express');
const courseController = require('../../controllers/course/course.controller');
const wrapAsync = require('../../utils/wrapAsync');
const { verifyToken, userDetail } = require('../../utils/verifyUser');

const router = express.Router();

// View all courses (Everyone)
router.get('/', wrapAsync(courseController.index));

// Enroll in a course (Only Logged-in Users)
router.post('/enroll', verifyToken, wrapAsync(courseController.enrollCourse));

// View a specific course (Everyone)
router.get('/:slug', userDetail, wrapAsync(courseController.showCourse));

module.exports = router;
