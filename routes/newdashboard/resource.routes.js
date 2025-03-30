const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');

const {
    getCourses,
    getBranches,
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

router.get('/branches', wrapAsync(getBranches));

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
