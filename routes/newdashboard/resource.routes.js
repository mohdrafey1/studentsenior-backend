const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');

const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    getSubjects,
    addSubject,
    editSubject,
    deleteSubject,
} = require('../../controllers/newdashboard/resource.controller.js');

const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser.js');

router.get('/courses', wrapAsync(getCourses));

router.post(
    '/courses',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(createCourse)
);

router.put(
    '/courses/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(updateCourse)
);

router.delete(
    '/courses/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(deleteCourse)
);

//  Branches Routes
router.get('/branches', wrapAsync(getBranches));

router.post(
    '/branches',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(createBranch)
);

router.put(
    '/branches/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(updateBranch)
);

router.delete(
    '/branches/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(deleteBranch)
);

//  Subjects Routes
router.get('/subjects', wrapAsync(getSubjects));

router.post(
    '/subjects',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(addSubject)
);

router.put(
    '/subjects/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(editSubject)
);

router.delete(
    '/subjects/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(deleteSubject)
);

module.exports = router;
