const express = require('express');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');
const wrapAsync = require('../../utils/wrapAsync');
const {
    allUsers,
    allDashboardUser,
} = require('../../controllers/newdashboard/user.controller');

const router = express.Router();

router.get(
    '/',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(allUsers)
);

router.get(
    '/dashboarduser',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(allDashboardUser)
);

module.exports = router;
