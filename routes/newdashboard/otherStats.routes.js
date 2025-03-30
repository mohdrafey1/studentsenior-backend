const express = require('express');
const {
    otherStats,
    allContactUs,
    deleteContactUs,
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

router.delete(
    '/contactus/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(deleteContactUs)
);

module.exports = router;
