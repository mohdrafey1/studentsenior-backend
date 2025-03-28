const express = require('express');
const courseController = require('../../controllers/newdashboard/course.controller');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');
const wrapAsync = require('../../utils/wrapAsync');

const router = express.Router();

// View all courses (Everyone)
router.get('/', wrapAsync(courseController.index));

// View a specific course (Everyone)
router.get(
    '/:slug',
    requireRole(['Admin', 'Moderator']),
    wrapAsync(courseController.showCourse)
);

// Create a new course (Only Admin & Moderators)
router.post(
    '/',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(courseController.createCourse)
);

// Edit a course (Admin & Moderators)
router.put(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(courseController.editCourse)
);

// Delete a course (Only Admin)
router.delete(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(courseController.deleteCourse)
);

module.exports = router;
