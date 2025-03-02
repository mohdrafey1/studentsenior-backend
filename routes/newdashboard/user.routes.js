const express = require('express');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');
const wrapAsync = require('../../utils/wrapAsync');
const { allUsers } = require('../../controllers/newdashboard/user.controller');

const router = express.Router();

router.get(
    '/',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(allUsers)
);

module.exports = router;
