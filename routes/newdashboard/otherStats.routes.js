const express = require('express');
const {
    otherStats,
    allContactUs,
} = require('../../controllers/newdashboard/otherStats.controller');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');
const wrapAsync = require('../../utils/wrapAsync');

const router = express.Router();

router.get('/', wrapAsync(otherStats));

router.get(
    '/contactus',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(allContactUs)
);

module.exports = router;
